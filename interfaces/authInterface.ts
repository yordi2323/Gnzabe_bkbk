import { Types } from 'mongoose';
import { Document } from 'mongoose';

export interface IAuthDocument extends Document {
  fullName: string;
  name: string;
  email: string;
  primaryEmail: string;

  password: string;
  passwordConfirm?: string;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;

  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  isApproved?: boolean;
  phoneNumber: string;

  otp?: string;
  otpExpiry?: Date;
  mfaEnabled: boolean;
  mfaBy: 'email' | 'sms' | 'authenticator';
  role: 'employee' | 'departmentAdmin';
  // departmentId?: Types.ObjectId;

  isLocked: boolean;
  isPasswordCorrect(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  createPasswordResetToken(): string;
  createVerificationToken(): string;
  resetFailedLoginAttemptsMade(): void;
  incrementFailedLoginAttemptsMade(): void;
}
