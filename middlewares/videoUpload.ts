import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utilities/catchAsync';
import { AppError } from '../utilities/appError';
import { ObjectId } from 'mongoose';

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR_VIDEO || 'public/videos');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // keep original extension
    const name = req.body.title?.en?.split(' ')[0]?.toLowerCase() || 'video';
    const filename = `${name}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const videoFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  const allowedVideoMimeTypes = ['video/mp4', 'video/mkv', 'video/quicktime'];
  if (allowedVideoMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only MP4, MKV, and MOV video formats are allowed!'));
  }
};

export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
});

// export const UploadTutorialVideo = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   // Check if there is a file under 'video'
//   const contentType = req.headers['content-type'];

//   const isMultipart = contentType?.includes('multipart/form-data');

//   if (
//     !isMultipart ||
//     !req.body ||
//     !('videoUrl' in req.body || req.file || req.files)
//   ) {
//     // Skip multer entirely
//     console.log('No video file found, skipping upload');
//     return next();
//   }

//   // Use multer to handle the upload only if a file is present
//   const uploader = uploadVideo.single('videoUrl');

//   uploader(req, res, function (err: any) {
//     if (err) {
//       console.log(err);
//       return next(new AppError('Failed to upload video', 400));
//     }
//     next();
//   });
// };

// export const handleVideoUpload = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     console.log(req.file);
//     if (!req.file) return next();
//     req.body.videoUrl = req.file.filename; // or full path
//     // console.log('Video uploaded successfully:', req.file.filename);
//     next();
//   },
// );

// export const handleVideoUpload = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//     if (files?.video?.[0]) {
//       const videoFile = files.video[0];
//       const ext = path.extname(videoFile.originalname); // preserve original extension
//       const baseName = req.body?.title?.en
//         ? req.body.title.en.split(' ')[0].toLowerCase()
//         : `default-video-${Math.random().toString(36).substring(2, 8)}`;
//       const filename = `${baseName}-${Date.now()}${ext}`;
//       const uploadDir = process.env.UPLOAD_DIR_VIDEO || 'public/videos';

//       // Make sure directory exists
//       await fs.mkdir(uploadDir, { recursive: true });

//       const filePath = path.join(uploadDir, filename);
//       await fs.writeFile(filePath, videoFile.buffer); // Write from memory buffer

//       req.body.videoUrl = filename;
//       console.log('Video saved to disk:', filePath);
//     }

//     console.log(req.body, 'req.body after video upload');

//     next();
//   },
// );

// export const uploadTutorialVideo = uploadVideo.single('video');

export const uploadTutorialAssets = multer({
  storage: multer.memoryStorage(), // or use disk for video
  fileFilter: (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/png'];
    const videoTypes = ['video/mp4', 'video/mkv', 'video/quicktime'];

    if (
      imageTypes.includes(file.mimetype) ||
      videoTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type!'));
    }
  },
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video_en', maxCount: 1 },
  { name: 'video_am', maxCount: 1 },
]);

export const handleVideoUpload = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const uploadDir = process.env.UPLOAD_DIR_VIDEO || 'public/videos';

    if (!files?.video_en && !files?.video_am) {
      return next();
    }

    const videoUrl: { en?: string; am?: string } = {};
    const tasks: Promise<void>[] = [];

    // Handle English video
    if (files?.video_en?.[0]) {
      const videoFileEn = files.video_en[0];
      const extEn = path.extname(videoFileEn.originalname);
      const baseNameEn = req.body?.title?.en
        ? req.body.title.en.split(' ')[0].toLowerCase()
        : `default-video${Math.random().toString(36).substring(2, 8)}`;
      const filenameEn = `${baseNameEn}-en-${Date.now()}${extEn}`;
      const filePathEn = path.join(uploadDir, filenameEn);
      videoUrl.en = filenameEn;
      tasks.push(
        fs
          .mkdir(uploadDir, { recursive: true })
          .then(() => fs.writeFile(filePathEn, videoFileEn.buffer))
          .then(() => {
            console.log('English video saved to disk:', filePathEn);
          }),
      );
    }

    // Handle Amharic video
    if (files?.video_am?.[0]) {
      const videoFileAm = files.video_am[0];
      const extAm = path.extname(videoFileAm.originalname);
      const baseNameAm = req.body?.title?.en
        ? req.body.title.en.split(' ')[0].toLowerCase()
        : `default-video${Math.random().toString(36).substring(2, 8)}`;
      const filenameAm = `${baseNameAm}-am-${Date.now()}${extAm}`;
      const filePathAm = path.join(uploadDir, filenameAm);
      videoUrl.am = filenameAm;
      tasks.push(
        fs
          .mkdir(uploadDir, { recursive: true })
          .then(() => fs.writeFile(filePathAm, videoFileAm.buffer))
          .then(() => {
            console.log('Amharic video saved to disk:', filePathAm);
          }),
      );
    }

    await Promise.all(tasks);

    req.body.videoUrl = videoUrl;
    console.log('Video URLs:', videoUrl);
    next();
  },
);
