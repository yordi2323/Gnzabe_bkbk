import express from 'express';
import {
  approveUser,
  disApproveUser,
  getAllUsers,
  getCurrentUser,
  getMyRanking,
  getUser,
  terminateUser,
  updateMe,
  updateUser,
} from '../controllers/user.controller';
import { protectUser } from '../middlewares/auth.user.middleware';
import {
  protectCompany,
  protectUserOrCompany,
} from '../middlewares/auth.company.middleware';
import { allowedToCompanyOrDepartmentAdmin } from '../middlewares/middlewares';
import { resizePhoto, uploadPhoto } from '../middlewares/photoUpload';
import { protectOwner } from '../middlewares/auth.platformOwner.middleware';

const router = express.Router();

router.route('/approve').post(allowedToCompanyOrDepartmentAdmin, approveUser); // Assuming this is for approving a user, adjust as necessary

router
  .route('/disapprove')
  .post(allowedToCompanyOrDepartmentAdmin, disApproveUser); // Assuming this is for disapproving a user, adjust as necessary

router.route('/terminate/:id').delete(protectUserOrCompany, terminateUser);
router.route('/').get(protectOwner, getAllUsers);

router.use(protectUser);
router.route('/update-me').patch(uploadPhoto, resizePhoto, updateMe); // This route is for the user to update their own information

router.route('/get-current-user').get(getCurrentUser);

// NOTE should be based on role

router.route('/get-my-ranking').get(getMyRanking);

router.route('/:id').get(getUser).patch(updateUser);

export default router;
