import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { catchAsync } from '../utilities/catchAsync';
import PlatformOwner from '../model/platformOwnerModel';
import {
  queueOtpEmail,
  queuePasswordResetEmail,
  queueVerificationEmail,
} from '../services/email.service';
import { AppError } from '../utilities/appError';
import { cookieOptions, signToken } from './authFactory';
import { generateOtp } from '../utilities/helper';
import axios from 'axios';
import { sendNotification } from '../services/notification.service';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber, password, passwordConfirm } = req.body;
    if (!name || !email || !phoneNumber || !password || !passwordConfirm) {
      return next(
        new AppError(
          'All fields are required name, email, phoneNumber, password, and passwordConfirm',
          400,
        ),
      );
    }
    if (password !== passwordConfirm) {
      return next(
        new AppError('Password and Password Confirm do not match', 400),
      );
    }

    const platformOwner = await PlatformOwner.create({
      name,
      email,
      phoneNumber,
      password,
      role: 'admin', // Default role
    });

    const verificationToken = platformOwner.createVerificationToken();
    await platformOwner.save({ validateBeforeSave: false });

    await queueVerificationEmail(
      req,
      email,
      platformOwner.id.toString(),
      verificationToken,
      name,
    );

    platformOwner.verificationToken = undefined;
    platformOwner.verificationTokenExpiry = undefined;

    return res.status(201).json({
      status: 'success',
      message: 'Platform Owner created successfully. Please verify your email.',
      data: {
        document: platformOwner,
      },
    });
  },
);

export const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, id } = req.query;
    if (!token || !id) {
      return next(new AppError('Token and ID are required', 400));
    }
    if (typeof token !== 'string' || typeof id !== 'string') {
      return next(new AppError('Invalid token or ID format', 400));
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const platformOwner = await PlatformOwner.findOne({
      _id: id,
      verificationToken: hashedToken,
    });

    if (!platformOwner)
      return next(new AppError('Invalid verification token or ID', 400));

    if (
      platformOwner.verificationTokenExpiry &&
      platformOwner.verificationTokenExpiry!.getTime() < Date.now()
    ) {
      const verificationToken = platformOwner.createVerificationToken();

      await platformOwner.save({ validateBeforeSave: false });

      await queueVerificationEmail(
        req,
        platformOwner.email,
        platformOwner.id.toString(),
        verificationToken,
        platformOwner.name,
      );
    }

    platformOwner.isVerified = true;
    platformOwner.verificationToken = undefined;
    platformOwner.verificationTokenExpiry = undefined;
    platformOwner.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: 'success',
      message:
        'Email verified successfully. Please login to access your admin dashboard.',
      data: {
        document: platformOwner,
      },
    });
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const platformOwner = await PlatformOwner.findOne({ email }).select(
      '+password',
    );

    if (platformOwner && platformOwner.isLocked) {
      return next(
        new AppError(
          `Your account is locked until ${platformOwner.accountLockedUntil}. Please contact support.`,
          403,
        ),
      );
    }
    if (!platformOwner) {
      console.log('Platform owner not found');
      return next(new AppError('Invalid email or password', 401));
    }

    if (
      !(await platformOwner.isPasswordCorrect(password, platformOwner.password))
    ) {
      console.log('Password is incorrect', password, platformOwner.password);
      platformOwner.incrementFailedLoginAttemptsMade();
      await platformOwner.save({ validateBeforeSave: false });

      return next(new AppError('Invalid email or password', 401));
    }

    if (!platformOwner.isVerified) {
      return next(
        new AppError(
          'Your email is not verified. Please check your email for the verification link.',
          403,
        ),
      );
    }

    if (!platformOwner.isActive) {
      return next(
        new AppError('Your account is inactive. Please contact support.', 403),
      );
    }

    platformOwner.resetFailedLoginAttemptsMade();
    await platformOwner.save({ validateBeforeSave: false });
    const token = signToken(
      platformOwner.id.toString(),
      process.env.JWT_EXPIRES_IN_HOUR,
    );

    if (platformOwner.mfaEnabled) {
      if (platformOwner.mfaBy === 'email') {
        const otp = generateOtp();
        platformOwner.otp = otp;
        platformOwner.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await queueOtpEmail(platformOwner.email, otp, platformOwner.name);
      }
      if (platformOwner.mfaBy === 'sms') {
        console.log(
          `${process.env.GEEZ_URL}phone=${platformOwner.phoneNumber}`,
        );
        const response = await axios({
          url: `${process.env.GEEZ_URL}phone=${platformOwner.phoneNumber}`,
          method: 'POST',
        });

        if (response.data.error) {
          return next(new AppError('Failed to send OTP via SMS', 500));
        }
        const otp = response.data.code;
        platformOwner.otp = otp;
        platformOwner.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
      }

      await platformOwner.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: 'success',
        message: `OTP sent to you via ${platformOwner.mfaBy} successfully`,
        data: {
          id: platformOwner._id,
          otpRequired: true,
        },
      });
    }

    // Generate JWT token and send response (not implemented here)
    // ...

    res.cookie('jwt', token, cookieOptions(req));

    return res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      token,
      data: {
        document: platformOwner,
      },
    });
  },
);

export const verifyOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, otp } = req.query;
    if (!id || !otp) {
      return next(new AppError('ID and OTP are required', 400));
    }
    if (typeof id !== 'string' || typeof otp !== 'string') {
      return next(new AppError('Invalid ID or OTP format', 400));
    }

    const platformOwner = await PlatformOwner.findOne({
      _id: id,
      otp,
      otpExpiry: { $gt: new Date() },
    });

    if (!platformOwner) {
      return next(new AppError('Invalid id or otp has expired', 400));
    }

    platformOwner.otp = undefined;
    platformOwner.otpExpiry = undefined;
    await platformOwner.save({ validateBeforeSave: false });

    const token = signToken(
      platformOwner.id.toString(),
      process.env.JWT_EXPIRES_IN_HOUR,
    );

    res.cookie('jwt', token, cookieOptions(req));

    await sendNotification({
      recipient: platformOwner._id as string,
      type: 'otp_verification',
      title: 'verified Successful',
      message: `You have successfully verified otp verification in at`,
    });

    res.status(200).json({
      status: 'success',
      message: 'OTP verified successfully',
      token,
      data: {
        document: platformOwner,
      },
    });
  },
);

export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('jwt', 'loggedout', cookieOptions(req));

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  },
);

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    const platformOwner = await PlatformOwner.findOne({ email });
    if (!platformOwner) {
      return next(new AppError('No user found with this email', 404));
    }
    const resetToken = platformOwner.createPasswordResetToken();
    await platformOwner.save({ validateBeforeSave: false });

    await queuePasswordResetEmail(
      req,
      email,
      platformOwner.id.toString(),
      resetToken,
      platformOwner.name,
    );

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent successfully',
    });
  },
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, token, password, passwordConfirm } = req.body;
    if (!id || !token || !password || !passwordConfirm) {
      return next(
        new AppError(
          'ID, token, password, and passwordConfirm are required',
          400,
        ),
      );
    }
    if (password !== passwordConfirm) {
      return next(
        new AppError('Password and Password Confirm do not match', 400),
      );
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const platformOwner = await PlatformOwner.findOne({
      _id: id,
      passwordResetToken: hashedToken,
      passwordResetTokenExpiry: { $gt: new Date() },
    });

    console.log(platformOwner);

    if (!platformOwner) {
      return next(new AppError('Invalid token or ID', 400));
    }
    platformOwner.password = password;
    platformOwner.passwordResetToken = undefined;
    platformOwner.passwordResetTokenExpiry = undefined;
    await platformOwner.save({ validateBeforeSave: true });

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
    });
  },
);