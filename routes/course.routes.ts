import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourse,
  getCourseForDepartmen,
  updateCourse,
} from '../controllers/course.controller';
import { resizeThumbnail, uploadThumbnail } from '../middlewares/photoUpload';
import { convertPriceToNumber } from '../middlewares/middlewares';
import { protectUserOrCompany } from '../middlewares/auth.company.middleware';
import {
  protectOwner,
  protectUserCompanyOwner,
} from '../middlewares/auth.platformOwner.middleware';
// import { protectCompany } from '../middlewares/middlwares';

const router = express.Router();

// router.use(protectCompany);

router
  .route('/')
  .get(protectUserCompanyOwner, getCourseForDepartmen, getAllCourses)
  .post(
    protectOwner,
    uploadThumbnail,
    resizeThumbnail,
    convertPriceToNumber,
    createCourse,
  );

router
  .route('/:id')
  .get(protectUserCompanyOwner, getCourse)
  .patch(protectOwner, uploadThumbnail, resizeThumbnail, updateCourse);

export default router;

// http://localhost:3334/images/security-1750665210962.jpeg
