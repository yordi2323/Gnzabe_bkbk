import express from 'express';
import {
  clearAllNotifications,
  clearNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  requestCourseAssignment,
} from '../controllers/notification.controller';
import { protectUser } from '../middlewares/auth.user.middleware';
const router = express.Router();

router.route('/:id').get(getNotifications);

router.route('/mark-notification-as-read/:id').post(markNotificationAsRead);

router.route('/clear-notification/:id').post(clearNotification);

router.route('/clear-all-notifications/:id').post(clearAllNotifications);

router
  .route('/request-course-assignment/:id')
  .post(protectUser, requestCourseAssignment);

export default router;
