import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import useragent from 'express-useragent';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import authRouter from './routes/auth.routes';
import companyRouter from './routes/company.routes';
import courseRouter from './routes/course.routes';
import departmentRouter from './routes/department.routes';
import notificationRouter from './routes/notification.routes';
import QuizRouter from './routes/quiz.routes';
import tutorialRouter from './routes/tutorial.routes';
import userRouter from './routes/user.routes';
import quizResultsRouter from './routes/quizResult.routes';
import platformOwnerRouter from './routes/auth.platformOwner.routes';

import fs from 'fs';
import globalErrorHandler from './controllers/error.controller';
import { attachRequestMeta, sanitizeInputs } from './middlewares/middlewares';
import { platform } from 'os';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://192.168.2.249:5173',
  'https://gnzabe.com',
  'https://production.gnzabe.com',
  'https://prod.gnzabe.com',
  'https://golden-donut-eb59a2.netlify.app',
  'https://gnzabe-security-training.netlify.app',
  'https://gnzabe-security-training1.netlify.app',
  'https://gnzabe-security-training2.netlify.app',
  'https://gnezabe-expo-ft.onrender.com',
];

const app = express();
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());
app.set('trust proxy', 1);
app.use(useragent.express()); // Required for parsing user-agent
app.use(attachRequestMeta);

app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/images/', express.static(process.env.UPLOAD_DIR_IMAGE!));
app.use('/videos/', express.static(process.env.UPLOAD_DIR_VIDEO!));
// app.use('/videos', express.static(path.resolve(__dirname, '../public/videos')));

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, false);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.params);
  mongoSanitize.sanitize(req.query);
  next();
});
app.use(sanitizeInputs);
app.use(compression());

const limiter = rateLimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request! Try again after an hour',
});

app.use(limiter);
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/quizzes', QuizRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/companies', companyRouter);
app.use('/api/v1/tutorials', tutorialRouter);
app.use('/api/v1/authentication', authRouter);
app.use('/api/v1/departments', departmentRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/quiz-results', quizResultsRouter);
app.use('/api/v1/platform-owners', platformOwnerRouter);

app.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error!');
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.originalUrl, 'error');
  res.status(404).json({
    status: 'fail',
    message: `Couldnot find this ${req.originalUrl} on this server`,
  });
});

Sentry.setupExpressErrorHandler(app);

app.use(globalErrorHandler);

export default app;
