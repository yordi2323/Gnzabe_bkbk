// scripts/cleanupImages.ts
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Course from '../model/courseModel';
import Company from '../model/companyModel';

const imageFolder = path.join(process.cwd(), 'public/images');

const cleanupImages = async () => {
  const courseThumbnails = await Course.find().distinct('thumbnail');
  const companyLogos = await Company.find().distinct('logo');

  const usedImages = new Set([...courseThumbnails, ...companyLogos]);

  const files = fs.readdirSync(imageFolder);

  for (const file of files) {
    if (!usedImages.has(file) && !file.startsWith('default-')) {
      fs.unlinkSync(path.join(imageFolder, file));
      console.log(`Deleted unused image: ${file}`);
    }
  }
};

export default cleanupImages;
