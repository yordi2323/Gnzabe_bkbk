import { Schema, model, Types } from 'mongoose';
import { INotification } from '../interfaces/notificationInterface';
import { cloudConnection } from '../config/dbConfig';

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // recipientModel: {
    //   type: String,
    //   required: true,
    //   enum: ['User', 'Company'],
    // },
    type: {
      type: String,
      enum: [
        'registration',
        'passwordReset',
        'courseAssignment',
        'progressReport',
        'custom',
        'login',
        'departmentDeactivated',
        'departmentActivated',
        'approvalRequest',
        'otp_verification',
        'courseAssignmentRequest',
      ],
      required: true,
    },
    title: String,
    message: String,
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

const Notification = cloudConnection.model<INotification>(
  'Notification',
  notificationSchema,
);

export default Notification;
