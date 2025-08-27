import mongoose, { Model, Schema } from 'mongoose';
import IQuizResult from '../interfaces/quizResultInterface';
import { cloudConnection } from '../config/dbConfig';

const quizResultSchema: Schema<IQuizResult> = new mongoose.Schema<IQuizResult>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz ID is required'],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company ID is required'],
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee ID is required'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
    },
    tutorialId: {
      type: Schema.Types.ObjectId,
      ref: 'Tutorial',
      required: [true, 'Tutorial ID is required'],
    },
    answers: {
      type: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Question ID is required'],
          },
          selectedAnswer: {
            en: {
              type: String,
              default: '',
            },
            am: {
              type: String,
              default: '',
            },
          },
          isCorrect: {
            type: Boolean,
            default: false,
          },
        },
      ],
      required: [true, 'Answers are required'],
      validate: {
        validator: function (value: IQuizResult['answers']) {
          return Array.isArray(value) && value.length > 0;
        },
        message: 'At least one answer is required',
      },
    },
    score: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    durationInSeconds: {
      type: Number,
      required: [true, 'Duration in seconds is required'],
      validate: {
        validator: function (value: number) {
          return value > 0;
        },
        message: 'Duration must be greater than 0 seconds',
      },
    },
    feedback: {
      type: String,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

// ✅ Allow only one result per employee per quiz

// quizResultSchema.index({ quizId: 1, employeeId: 1 }, { unique: true });

const QuizResult: Model<IQuizResult> = cloudConnection.model<IQuizResult>(
  'QuizResult',
  quizResultSchema,
);

export default QuizResult;
