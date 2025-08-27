import mongoose, { Model, Schema } from 'mongoose';
import IQuiz, { IQuestion } from '../interfaces/quizInterface';
import { cloudConnection } from '../config/dbConfig';

// const departmentId = '...'; // department you want stats for

// const stats = await QuizResult.aggregate([
//   { $match: { department: mongoose.Types.ObjectId(departmentId) } },
//   {
//     $group: {
//       _id: '$employee',
//       averageScore: { $avg: '$score' },
//     },
//   },
//   {
//     $sort: { averageScore: -1 },
//   },
//   {
//     $lookup: {
//       from: 'users',
//       localField: '_id',
//       foreignField: '_id',
//       as: 'employeeDetails',
//     },
//   },
//   {
//     $project: {
//       employee: { $arrayElemAt: ['$employeeDetails', 0] },
//       averageScore: 1,
//     },
//   },
// ]);

const quizSchema: Schema<IQuiz> = new mongoose.Schema<IQuiz>(
  {
    title: {
      en: {
        type: String,
        required: [true, 'English title is required'],
        trim: true,
      },
      am: {
        type: String,
        required: [true, 'Amharic title is required'],
        trim: true,
      },
    },
    description: {
      en: {
        type: String,
        required: [true, 'English description is required'],
        trim: true,
      },
      am: {
        type: String,
        required: [true, 'Amharic description is required'],
        trim: true,
      },
    },
    questions: {
      type: [
        {
          question: {
            en: { type: String, required: true },
            am: { type: String, required: true },
          },
          options: {
            en: {
              type: [String],
              required: true,
              validate: (val: string[]) => val.length > 1,
            },
            am: {
              type: [String],
              required: true,
              validate: (val: string[]) => val.length > 1,
            },
          },
          correctAnswer: {
            en: { type: String, required: true },
            am: { type: String, required: true },
          },
        },
      ],
      required: true,
      validate: (val: IQuestion[]) => val.length > 0,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    tutorialId: {
      type: Schema.Types.ObjectId,
      ref: 'Tutorial',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
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

quizSchema.index({ 'title.en': 1 }, { unique: true, sparse: true });
quizSchema.index({ 'title.am': 1 }, { unique: true, sparse: true });

const Quiz: Model<IQuiz> = cloudConnection.model<IQuiz>('Quiz', quizSchema);

export default Quiz;
