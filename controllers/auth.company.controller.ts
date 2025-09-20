import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import { ICompany } from '../interfaces/companyInterface';
import Company from '../model/companyModel';
import { catchAsync } from '../utilities/catchAsync';
import authFactory from './authFactory';
import { queueInivationEmail } from '../services/email.service';
import { AppError } from '../utilities/appError';
import { extractEmails } from '../utilities/helper';

import { isCompanyEmail } from '../utilities/validateCompanyEmail';

export const signupCompany = authFactory.createSignupController<ICompany>(
  Company,
  {
    allowedFields: [
      'name',
      'primaryEmail',
      'secondaryEmail',
      'phoneNumber',
      'password',
      'passwordConfirm',
    ],

    emailField: 'primaryEmail',
    nameField: 'name',

    beforeCreate: (body: any) => {
      console.log("Request body:", body);
      const { primaryEmail, secondaryEmail } = body;

      console.log(`Validating email: ${primaryEmail}, Is company email: ${isCompanyEmail(primaryEmail)}`);
      console.log(`Validating email: ${secondaryEmail}, Is company email: ${isCompanyEmail(secondaryEmail)}`);

      if (!isCompanyEmail(primaryEmail)) {
        throw new AppError('Primary email must be a company email', 400);
      }
      if (secondaryEmail && !isCompanyEmail(secondaryEmail)) {
        throw new AppError('Secondary email must be a company email', 400);
      }
    },
  },
);

export const loginCompany = authFactory.createLoginController<ICompany>(
  Company,
  ['primaryEmail', 'password'],
  ['primaryEmail'],
);

export const verifyCompany = authFactory.createVerificationController(Company, {
  redirectUrl: 'https://prod.gnzabe.com/login',
  fallBackUrl: 'https://prod.gnzabe.com/verification-failed',
});

export const verifyCompanyOtp =
  authFactory.createOtpVerificationController(Company);

export const getCompanyPasswordResetToken =
  authFactory.createResetLinkController(Company, 'primaryEmail');

export const resetCompanyPassword =
  authFactory.createResetPasswordController(Company);

export const logoutCompany = authFactory.createLogoutController();

export const inviteCompanyEmployees = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { departmentId, invitedEmployees } = req.body;
    let companyId: string | undefined;
    let companyName: string | undefined;
    let company = req.company;

    if (!company) {
      // Try to get companyId from logged-in user
      if (req.user && req.user.companyId) {
        companyId = req.user.companyId.toString();
        departmentId = req.user.departmentId?.toString();
        // Fetch company name from DB
        const foundCompany = await Company.findById(companyId).select('name');
        if (!foundCompany) {
          return next(new AppError('Company not found for user', 404));
        }
        companyName = foundCompany.name;
      } else {
        return next(new AppError('Company not authenticated', 401));
      }
    } else {
      companyId = company.id;
      companyName = company.name;
    }

    if (
      !departmentId ||
      !Array.isArray(invitedEmployees) ||
      invitedEmployees.length === 0
    ) {
      return next(
        new AppError('departmentId and invitedEmployees are required', 400),
      );
    }
    const baseUrl = 'https://prod.gnzabe.com/register';

    await Promise.all(
      invitedEmployees.map(async (email: string) => {
        const token = Jwt.sign(
          { companyId, departmentId, email },
          process.env.JWT_SECRET as string,
          {
            expiresIn: '1d',
          },
        );

        const link = `${baseUrl}?token=${encodeURIComponent(token)}`;

        console.log(link, companyName);
        await queueInivationEmail(
          link,
          email,
          email.split('@')[0],
          companyName,
        );
      }),
    );

    res.status(200).json({
      status: 'success',
      message: 'Invitation emails queued successfully',
    });
  },
);

export const inviteCompnayEmployeesFromCSV = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let departmentId = req.body.departmentId;
    const fileBuffer = req.file?.buffer;
    let company = req.company;
    let companyId: string | undefined;
    let companyName: string | undefined;

    if (!departmentId || !fileBuffer) {
      return res.status(400).json({ message: 'Missing departmentId or file' });
    }

    if (!company) {
      // Try to get companyId from logged-in user
      if (req.user && req.user.companyId) {
        companyId = req.user.companyId.toString();
        departmentId = req.user.departmentId?.toString();
        // Fetch company name from DB
        const foundCompany = await Company.findById(companyId).select('name');
        if (!foundCompany) {
          return next(new AppError('Company not found for user', 404));
        }
        companyName = foundCompany.name;
      } else {
        return next(new AppError('Company not authenticated', 401));
      }
    } else {
      companyId = company.id;
      companyName = company.name;
    }
    const baseUrl = 'https://prod.gnzabe.com/register';

    const invitedEmails = await extractEmails(fileBuffer);

    await Promise.all(
      invitedEmails.map(async (email: string) => {
        const link = `${baseUrl}?companyId=${encodeURIComponent(
          companyId ? companyId.toString() : '',
        )}&departmentId=${encodeURIComponent(
          departmentId,
        )}&email=${encodeURIComponent(email)}`;

        await queueInivationEmail(
          link,
          email,
          email.split('@')[0],
          companyName,
        );
      }),
    );

    res.status(200).json({
      status: 'success',
      message: 'Invitation emails queued successfully',
      invitedCount: invitedEmails.length,
      invitedEmails,
    });
  },
);
