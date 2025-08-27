import { Document, Types } from 'mongoose';

export interface IPlatformOwner extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordChangedAt?: Date;
  otp?: string;
  otpExpiry?: Date;
  mfaEnabled: boolean;
  role: 'admin' | 'SuperAdmin';
  mfaBy: 'email' | 'sms' | 'authenticator';

  isApproved: boolean;
  isVerified: boolean;
  isActive: boolean;
  isLocked?: boolean;
  failedLoginAttemptsMade: number;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;

  preferences: {
    theme: 'light' | 'dark';
    language: 'am' | 'en' | 'om' | 'tg';
  };

  createdAt: Date;
  updatedAt: Date;
  accountLockedUntil?: Date;

  isPasswordCorrect(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  passwordChangedAfter(JWTTimeStamp: number): boolean;
  resetFailedLoginAttemptsMade(): Promise<void>;
  incrementFailedLoginAttemptsMade(): Promise<void>;
  createPasswordResetToken(): string;
  createVerificationToken(): string;
}
