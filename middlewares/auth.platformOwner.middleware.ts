import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
const { promisify } = require('util');
import { IPlatformOwner } from '../interfaces/platformOwnerInterface';
import { catchAsync } from '../utilities/catchAsync';
import { AppError } from '../utilities/appError';
import PlatformOwner from '../model/platformOwnerModel';
import { cookieOptions, signToken } from '../controllers/authFactory';
import Company from '../model/companyModel';
import User from '../model/userModel';

declare global {
  namespace Express {
    interface Request {
      platformOwner?: IPlatformOwner;
    }
  }
}

export const protectOwner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ')[1];
    else if (req.cookies.jwt) token = req.cookies.jwt;

    if (token === 'null' || !token)
      return next(new AppError('You are not logged in please log in', 401));

    const decoded = await promisify(Jwt.verify)(token, process.env.JWT_SECRET);

    const platformOwner = await PlatformOwner.findById(decoded.id).select(
      '+passwordChangedAt',
    );
    if (!platformOwner) {
      return next(
        new AppError('The user belonging to this token does not exist', 401),
      );
    }
    if (platformOwner.passwordChangedAfter(decoded.iat)) {
      return next(
        new AppError('Password has been changed. Please login again!', 401),
      );
    }

    const newToken = signToken(decoded.id, process.env.JWT_EXPIRES_IN_HOUR);

    res.cookie('jwt', newToken, cookieOptions(req));

    req.platformOwner = platformOwner;
    next();
  },
);

export const protectUserCompanyOwner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ')[1];
    else if (req.cookies.jwt) token = req.cookies.jwt;

    if (token === 'null' || !token) {
      return next(new AppError('You are not logged in. Please log in.', 401));
    }

    // console.log(token);

    const decoded = await promisify(Jwt.verify)(token, process.env.JWT_SECRET);

    // Try to find user
    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    if (user) {
      console.log('user');
      if (user.passwordChangedAfter(decoded.iat))
        return next(
          new AppError('Password has been changed. Please login again!', 401),
        );
      const newToken = signToken(decoded.id, process.env.JWT_EXPIRES_IN_HOUR);
      res.cookie('jwt', newToken, cookieOptions(req));
      req.user = user;
      return next();
    }

    // Only check for company if no user is found
    const company = await Company.findById(decoded.id)
      .select('+passwordChangedAt')
      .populate({
        path: 'employees',
        select:
          '_id fullName email phoneNumber role departmentId isActive isApproved',
      });
    if (company) {
      console.log('company');
      if (company.passwordChangedAfter(decoded.iat))
        return next(
          new AppError('Password has been changed. Please login again!', 401),
        );
      const newToken = signToken(decoded.id, process.env.JWT_EXPIRES_IN_HOUR);
      res.cookie('jwt', newToken, cookieOptions(req));
      req.company = company;
      return next();
    }

    // Check for platformOwner if no user or company is found
    const platformOwner = await PlatformOwner.findById(decoded.id).select(
      '+passwordChangedAt',
    );
    if (platformOwner) {
      console.log('platformOwner');
      if (platformOwner.passwordChangedAfter(decoded.iat))
        return next(
          new AppError('Password has been changed. Please login again!', 401),
        );
      const newToken = signToken(decoded.id, process.env.JWT_EXPIRES_IN_HOUR);
      res.cookie('jwt', newToken, cookieOptions(req));
      req.platformOwner = platformOwner;
      return next();
    }

    return next(new AppError('You are not logged in. Please log in.', 401));
  },
);

export const protectUserOwner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    )
      token = req.headers.authorization.split(' ')[1];
    else if (req.cookies.jwt) token = req.cookies.jwt;

    if (token === 'null' || !token) {
      return next(new AppError('You are not logged in. Please log in.', 401));
    }

    const decoded = await promisify(Jwt.verify)(token, process.env.JWT_SECRET);

    // Try to find user
    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    if (user) {
      if (user.passwordChangedAfter(decoded.iat))
        return next(
          new AppError('Password has been changed. Please login again!', 401),
        );
      const newToken = signToken(decoded.id, process.env.JWT_EXPIRES_IN_HOUR);
      res.cookie('jwt', newToken, cookieOptions(req));
      req.user = user;
      return next();
    }

    // Check for platformOwner if no user is found
    const platformOwner = await PlatformOwner.findById(decoded.id).select(
      '+passwordChangedAt',
    );
    if (platformOwner) {
      if (platformOwner.passwordChangedAfter(decoded.iat))
        return next(
          new AppError('Password has been changed. Please login again!', 401),
        );
      const newToken = signToken(decoded.id, process.env.JWT_EXPIRES_IN_HOUR);
      res.cookie('jwt', newToken, cookieOptions(req));
      req.platformOwner = platformOwner;
      return next();
    }

    // Exclude company
    return next(new AppError('You are not logged in. Please log in.', 401));
  },
);
