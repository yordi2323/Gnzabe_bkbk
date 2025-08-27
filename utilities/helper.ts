/**
 * Removes the last segment (e.g., 'signup') from a URL path string and returns the result.
 * @param {string} path - The URL path string (e.g., '/v1/authentication/user/signup').
 * @returns {string} The path with the last segment removed (e.g., '/v1/authentication/user').
 */
import { Request, Response, NextFunction } from 'express';
import otpGenerator from 'otp-generator';
import { ICompany } from '../interfaces/companyInterface';
import { catchAsync } from './catchAsync';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { AppError } from './appError';

export function removeLastPathSegment(path: string): string {
  if (!path) return path;
  // Remove trailing slash if present
  const normalized = path.endsWith('/') ? path.slice(0, -1) : path;
  const lastSlash = normalized.lastIndexOf('/');
  if (lastSlash <= 0) return '';
  return normalized.slice(0, lastSlash);
}

export const generateOtp = () =>
  otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

/**
 * Filters a company object to only include _id, name, and departments fields.
 * @param company The company object from the database
 */
export function filterCompanyForRegistration(company: ICompany) {
  return {
    id: company._id,
    name: company.name,
    departments: company.departments?.filter((dept: any) => dept.isActive),
  };
}

// import fs from 'fs';
// import path from 'path';

// // export const deleteOldImage = (imageFilename: string) => {
// //   if (!imageFilename || imageFilename.startsWith('default-')) return;
// //   const imagePath = path.join(process.env.UPLOAD_DIR_IMAGE!, imageFilename);
// //   if (fs.existsSync(imagePath)) {
// //     fs.unlinkSync(imagePath);
// //   }
// // };

export const extractEmails = (fileBuffer: Buffer): Promise<string[]> => {
  const invitedEmails: string[] = [];
  return new Promise((resolve, reject) => {
    try {
      const stream = Readable.from(fileBuffer).pipe(csv({ headers: false }));

      stream.on('data', (row) => {
        const values = Object.values(row).flat();
        values.forEach((value) => {
          if (typeof value === 'string') {
            const email = value.trim();
            if (/^[^\s@]+@[^-\s@]+\.[^\s@]+$/.test(email)) {
              invitedEmails.push(email);
            }
          }
        });
      });

      stream.on('end', () => {
        resolve(invitedEmails);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (err) {
      console.log(err);
      reject(new AppError('Failed to extract employees email!', 500));
    }
  });
};
