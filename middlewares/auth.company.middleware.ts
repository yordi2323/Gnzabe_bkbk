import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
const { promisify } = require('util');
import { ICompany } from '../interfaces/companyInterface';
import { catchAsync } from '../utilities/catchAsync';
import { AppError } from '../utilities/appError';
import Company from '../model/companyModel';
import { cookieOptions, signToken } from '../controllers/authFactory';
import User from '../model/userModel';

declare global {
  namespace Express {
    interface Request {
      company?: ICompany;
    }
  }
}

export const protectCompany = catchAsync(
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

    const company = await Company.findById(decoded.id)
      .select('+passwordChangedAt')
      .populate({
        path: 'employees',
        select:
          '_id fullName email phoneNumber role departmentId isActive isApproved',
      });

    if (!company)
      return next(
        new AppError(
          'The Company blongs to this token does not exist anymore',
          401,
        ),
      );

    if (company.passwordChangedAfter(decoded.iat))
      return next(
        new AppError('Password has been changed. Please login again!', 401),
      );

    const newToken = signToken(decoded.id, process.env.JWT_EXPIRES_IN_HOUR);
    res.cookie('jwt', newToken, cookieOptions(req));

    req.company = company;

    next();
  },
);

export const protectUserOrCompany = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (token === 'null' || !token) {
    console.log(token, 'tttttttttttoooookeeeennnnnn');
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

  // Only check for company if no user is found
  else {
    const company = await Company.findById(decoded.id)
      .select('+passwordChangedAt')
      .populate({
        path: 'employees',
        select:
          '_id fullName email phoneNumber role departmentId isActive isApproved',
      });
    if (company) {
      if (company.passwordChangedAfter(decoded.iat))
        return next(
          new AppError('Password has been changed. Please login again!', 401),
        );
      const newToken = signToken(decoded.id, process.env.JWT_EXPIRES_IN_HOUR);
      res.cookie('jwt', newToken, cookieOptions(req));
      req.company = company;
      console.log('Companyy has loggggeddd in');
      return next();
    }
  }

  return next(new AppError('You are not logged in. Please log in.', 401));
};

export const protecAdminOrCompanay = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (token === 'null' || !token) {
    console.log(token, 'tttttttttttoooookeeeennnnnn');
    return next(new AppError('You are not logged in. Please log in.', 401));
  }

  const decoded = await promisify(Jwt.verify)(token, process.env.JWT_SECRET);

  // Try to find user
  const user = await User.findById(decoded.id).select('+passwordChangedAt');
  if (user && user.role === 'departmentAdmin') {
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
  else {
    const company = await Company.findById(decoded.id)
      .select('+passwordChangedAt')
      .populate({
        path: 'employees',
        select:
          '_id fullName email phoneNumber role departmentId isActive isApproved',
      });
    if (company) {
      if (company.passwordChangedAfter(decoded.iat))
        return next(
          new AppError('Password has been changed. Please login again!', 401),
        );
      const newToken = signToken(decoded.id, process.env.JWT_EXPIRES_IN_HOUR);
      res.cookie('jwt', newToken, cookieOptions(req));
      req.company = company;
      console.log('Companyy has loggggeddd in');
      return next();
    }
  }

  return next(new AppError('You are not logged in. Please log in.', 401));
};
