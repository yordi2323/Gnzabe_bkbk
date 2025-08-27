import express from 'express';
import {
  approveCompany,
  disApproveCompany,
  getAllCompanies,
  getCompaniesFroRegistration,
  getCompany,
  getCompletedCourses,
  getCourseStatus,
  getCourseTopPerformers,
  getCurrentCompany,
  getDepartmentComparision,
  getDepartmentRanking,
  getTopPerformersOfEachDepartment,
  updateCompany,
  updateMe,
} from '../controllers/company.controller';
import {
  protecAdminOrCompanay,
  protectCompany,
  protectUserOrCompany,
} from '../middlewares/auth.company.middleware';
import { protectOwner } from '../middlewares/auth.platformOwner.middleware';
import { resizeLogo, uploadLogo } from '../middlewares/photoUpload';

const router = express.Router();

router.route('/approve').post(protectOwner, approveCompany);
router.route('/approve').post(protectOwner, disApproveCompany); // Assuming this is for approving a company, adjust as necessary

router
  .route('/course-status/:courseId')
  .get(protecAdminOrCompanay, getCourseStatus);

router
  .route('/course-top-performers/:courseId')
  .get(protecAdminOrCompanay, getCourseTopPerformers);

router
  .route('/department-comparision')
  .get(protecAdminOrCompanay, getDepartmentComparision);
router
  .route('/get-monthly-completed-courses')
  .get(protecAdminOrCompanay, getCompletedCourses);

router
  .route('/departments-top-performers')
  .get(protectUserOrCompany, getTopPerformersOfEachDepartment);

router
  .route('/departments-ranking')
  .get(protectUserOrCompany, getDepartmentRanking);

router
  .route('/get-companies-for-registration')

  .get(getCompaniesFroRegistration);
router.route('/').get(protectOwner, getAllCompanies);
router.use(protectCompany);
router.route('/get-current-company').get(getCurrentCompany);
router.route('/:id').get(getCompany);

// NOTE upload profile picture for company and users

router.route('/update-me').patch(uploadLogo, resizeLogo, updateMe);

export default router;
