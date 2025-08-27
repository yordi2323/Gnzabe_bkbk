import { Types, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: Types.ObjectId;
  type:
    | 'registration'
    | 'passwordReset'
    | 'courseAssignment'
    | 'progressReport'
    | 'custom'
    | 'courseAssignmentRequest';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  isActive: boolean;
}
