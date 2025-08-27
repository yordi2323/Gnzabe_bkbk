import http from 'http';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

dotenv.config({
  path: './config.env',
});

// --- Initialize Sentry before anything else ---
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: 'trace',
  enableLogs: true,
  sendDefaultPii: true,
});

import connectToDatabase from './config/dbConfig';
import { Server } from 'socket.io';
import EmailWorker from './workers/emailWorker';

declare global {
  // Add the io property to globalThis
  // eslint-disable-next-line no-var
  var io: Server;
}

process.on('uncaughtException', (error: Error) => {
  console.log('UncaughtException shutting down...');
  console.log(error.name, error.message);
  Sentry.captureException(error);
  process.exit(1);
});

let server: http.Server;

(async () => {
  await connectToDatabase();

  // setupCronJobs();

  // Import app only after DB connection is established
  const app = (await import('./app')).default;
  const setupCronJobs = (await import('./jobs')).default;
  const watchUserChanges = (await import('./watchers/userWatchers'))
    .watchUserChanges;
  const watchDepartmentChanges = (await import('./watchers/departmentWatcher'))
    .watchDepartmentChanges;

  server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://gnzabe.com',
        'https://production.gnzabe.com',
        'https://golden-donut-eb59a2.netlify.app',
        // other origins if needed
      ],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Example: Notify user-specific messages
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('error', (err) => {
      console.error(`Socket error from ${socket.id}:`, err);
      Sentry.captureException(err);
    });
  });
  globalThis.io = io;

  setupCronJobs();
  watchUserChanges();
  watchDepartmentChanges();

  EmailWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`);
  });

  EmailWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
    Sentry.captureException(err);
  });

  server.listen(process.env.PORT!, () => {
    console.log(`server is running on port ${process.env.PORT}`);
  });
})();

process.on('unhandledRejection', (error: unknown) => {
  if (error instanceof Error) {
    console.log('Unhandled Rejection shutting down...');
    console.log(error.name, error.message);
    Sentry.captureException(error);
  } else console.log(error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('💣❌SIGTERM received, shutting down...');
  if (server) {
    server.close(() => {
      console.log('💣❌Process terminated!');
    });
  }
});
