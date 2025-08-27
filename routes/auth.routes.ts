import express from 'express';
import {
  getUserPasswordResetToken,
  loginUser,
  logoutUser,
  resetUserPassword,
  signupUser,
  // userRefreshToken,
  verifyUser,
  verifyUserOtp,
} from '../controllers/auth.user.controller';
import { verifyEmails } from '../middlewares/verifyEmail.middleware';
import { requireBodyFields } from '../middlewares/validateFields.middleware';
import {
  getCompanyPasswordResetToken,
  inviteCompanyEmployees,
  inviteCompnayEmployeesFromCSV,
  loginCompany,
  logoutCompany,
  resetCompanyPassword,
  signupCompany,
  verifyCompany,
  verifyCompanyOtp,
} from '../controllers/auth.company.controller';
import {
  protecAdminOrCompanay,
  protectCompany,
} from '../middlewares/auth.company.middleware';
import { uploadCSV } from '../middlewares/csvUpload';
import { extractUserInfoFromToken } from '../middlewares/auth.user.middleware';

const router = express.Router();

// NOTE user authentication routes
router.route('/user/signup').post(
  // verifyEmails(['email']),
  extractUserInfoFromToken,
  signupUser,
);

router
  .route('/user/login')
  .post(requireBodyFields(['email', 'password']), loginUser);

router.route('/user/verify').get(verifyUser);
router.route('/user/verify-otp').post(verifyUserOtp);
router.route('/user/get-reset-link').post(getUserPasswordResetToken);
router.route('/user/reset-password').post(resetUserPassword);

router.route('/user/logout').post(logoutUser);

// router.route('/user/refresh-token').get(userRefreshToken);

// NOTE compay authentication routes
router.route('/company/signup').post(
  // verifyEmails(['primaryEmail', 'secondaryEmail']),
  signupCompany,
);

router
  .route('/company/login')
  .post(requireBodyFields(['primaryEmail', 'password']), loginCompany);

router.route('/company/verify').get(verifyCompany);
router.route('/company/verify-otp').post(verifyCompanyOtp);
router.route('/company/get-reset-link').post(getCompanyPasswordResetToken);
router.route('/company/reset-password').post(resetCompanyPassword);

router
  .route('/company/invite-employees')
  .post(protecAdminOrCompanay, inviteCompanyEmployees);

router
  .route('/company/invite-employees-from-csv')
  .post(protecAdminOrCompanay, uploadCSV, inviteCompnayEmployeesFromCSV);

router.route('/company/logout').post(logoutCompany);
export default router;
