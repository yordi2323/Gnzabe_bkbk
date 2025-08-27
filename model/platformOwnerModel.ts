import { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IPlatformOwner } from '../interfaces/platformOwnerInterface';
import { localConnection } from '../config/dbConfig';

const platformOwnerSchema = new Schema<IPlatformOwner>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\+?[1-9]\d{1,14}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
    validate: {
      validator: function (value: string) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(
          value,
        );
      },
      message:
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (e.g., !@#$%)',
    },
  },

  passwordChangedAt: {
    type: Date,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  mfaEnabled: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ['admin', 'SuperAdmin'],
    default: 'admin',
    required: true,
  },
  mfaBy: {
    type: String,
    enum: ['email', 'sms', 'authenticator'],
    default: 'email',
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpiry: {
    type: Date,
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    language: {
      type: String,
      enum: ['am', 'en', 'om', 'tg'],
      default: 'en',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  failedLoginAttemptsMade: {
    type: Number,
    default: 0,
    max: 3,
    min: 0,
  },
  accountLockedUntil: {
    type: Date,
  },
});

platformOwnerSchema.virtual('isLocked').get(function () {
  return (
    this.accountLockedUntil && this.accountLockedUntil.getTime() > Date.now()
  );
});

platformOwnerSchema.virtual('hasOTPExpired').get(function () {
  return this.otpExpiry && this.otpExpiry.getTime() > Date.now();
});

platformOwnerSchema.pre('save', async function (this: IPlatformOwner, next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

platformOwnerSchema.methods.isPasswordCorrect = async function (
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

platformOwnerSchema.methods.passwordChangedAfter = function (
  JWTTimeStamp: number,
): boolean {
  if (!this.passwordChangedAt) return false;
  const passwordChangedAtStamp = this.passwordChangedAt.getTime() / 1000;
  return passwordChangedAtStamp > JWTTimeStamp;
};

platformOwnerSchema.methods.resetFailedLoginAttemptsMade = function () {
  this.failedLoginAttemptsMade = 0;
};

// Decrement failedLoginAttempts by 1, down to the min (0)
platformOwnerSchema.methods.incrementFailedLoginAttemptsMade = function () {
  if (this.failedLoginAttemptsMade < 3) {
    this.failedLoginAttemptsMade += 1;
  } else {
    // this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    this.accountLockedUntil = new Date(Date.now() + 60 * 1000);
  }
};

platformOwnerSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

platformOwnerSchema.methods.createVerificationToken = function (): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return verificationToken;
};

const PlatformOwner = localConnection.model<IPlatformOwner>(
  'PlatformOwner',
  platformOwnerSchema,
);

export default PlatformOwner;
