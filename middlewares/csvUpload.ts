import multer from 'multer';

const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  // Accept only CSV files
  if (
    file.mimetype === 'text/csv' ||
    file.originalname.toLowerCase().endsWith('.csv')
  ) {
    cb(null, true);
  } else {
    cb(new Error('The uploaded file is not a CSV file!'));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter as unknown as multer.Options['fileFilter'],
});

export const uploadCSV = upload.single('file');
