import { Schema, Types, model, Document } from 'mongoose';

export interface ICoursePurchase extends Document {
  companyId: Types.ObjectId;
  courseId: Types.ObjectId;
  pricePaid: number;
  currency: 'ETB' | 'USD';
  seats: number; // how many seats/licenses were bought
  seatsUsed: number; // auto‑increment as you assign to departments
  transactionId?: Types.ObjectId; // links to Transaction model
  paymentStatus: 'pending' | 'completed' | 'failed';
  purchasedAt: Date;
  expiresAt?: Date; // e.g. 1‑year licence
  isActive: boolean;
}

const coursePurchaseSchema = new Schema<ICoursePurchase>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    pricePaid: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['ETB', 'USD'], required: true },
    seats: { type: Number, required: true, min: 1 },
    seatsUsed: { type: Number, default: 0, min: 0 },
    transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    purchasedAt: { type: Date, default: Date.now },
    expiresAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// 🔒 Don’t let one company duplicate a course purchase accidentally:
coursePurchaseSchema.index({ companyId: 1, courseId: 1 }, { unique: false });

export default model<ICoursePurchase>('CoursePurchase', coursePurchaseSchema);
