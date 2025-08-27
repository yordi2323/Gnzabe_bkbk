import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utilities/catchAsync';
import multer from 'multer';

const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

// Remove custom MulterFile and MulterFilterCallback interfaces and use multer's types

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('The uploaded file is not an image!'));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadLogo = upload.fields([
  {
    name: 'logo',
    maxCount: 1,
  },
]);

export const uploadPhoto = upload.fields([
  {
    name: 'photo',
    maxCount: 1,
  },
]);

export const uploadThumbnail = upload.fields([
  {
    name: 'thumbnail',
    maxCount: 1,
  },
]);

export const resizeThumbnail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files?.thumbnail) return next();
    const baseName = req.body?.title?.en
      ? req.body.title.en.split(' ')[0].toLowerCase()
      : `default-thumbnail-${Math.random().toString(36).substring(2, 8)}`;
    const thumbnail = `${baseName}-${Date.now()}.jpeg`;

    console.log('Logo file:', files.thumbnail[0]);
    console.log('Buffer length:', files.thumbnail[0].buffer?.length);

    await sharp(files.thumbnail[0].buffer)
      .resize(1000, 1000)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${process.env.UPLOAD_DIR_IMAGE}/${thumbnail}`);

    console.log('file exists', thumbnail);
    req.body.thumbnail = thumbnail;
    next();
  },
);

export const resizeLogo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files?.logo) return next();
    const baseName = req.body?.name
      ? req.body.name.split(' ')[0].toLowerCase()
      : `default-logo-${Math.random().toString(36).substring(2, 8)}`;
    const image = `${baseName}-${Date.now()}.jpeg`;

    console.log('Logo file:', files.logo[0]);
    console.log('Buffer length:', files.logo[0].buffer?.length);

    await sharp(files.logo[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${process.env.UPLOAD_DIR_IMAGE}/${image}`);

    console.log('file exists', image);
    req.body.logo = image;

    console.log(req.body, 'req.body after logo upload');
    next();
  },
);

export const resizePhoto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files?.photo) return next();
    const baseName = req.body?.name
      ? req.body.name.split(' ')[0].toLowerCase()
      : `default-logo-${Math.random().toString(36).substring(2, 8)}`;
    const image = `${baseName}-${Date.now()}.jpeg`;

    console.log('Photo file:', files.photo[0]);
    console.log('Buffer length:', files.photo[0].buffer?.length);

    await sharp(files.photo[0].buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`${process.env.UPLOAD_DIR_IMAGE}/${image}`);

    console.log('file exists', image);
    req.body.photo = image;
    next();
  },
);
