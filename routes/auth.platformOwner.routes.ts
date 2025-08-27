import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
  verifyOTP,
} from '../controllers/auth.platformOwner.controller';

const router = express.Router();

router.post('/signup', signup);

router.route('/verify').get(verifyEmail);

router.route('/login').post(login);

router.route('/verify-otp').post(verifyOTP);

router.route('/logout').post(logout);

router.route('/forgot-password').post(forgotPassword);

router.route('/reset-password').post(resetPassword);

export default router;
