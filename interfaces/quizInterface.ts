import mongoose from 'mongoose';

export interface IQuestion {
  question: {
    en: string;
    am: string;
  };
  options: {
    en: string[];
    am: string[];
  };
  correctAnswer: {
    en: string;
    am: string;
  };
}

interface IQuiz extends mongoose.Document {
  title: {
    en: string;
    am: string;
  };
  description: {
    en: string;
    am: string;
  };
  questions: IQuestion[];
  courseId: mongoose.Schema.Types.ObjectId;
  tutorialId: mongoose.Schema.Types.ObjectId;
  createdBy?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  isActive: boolean;
}

export default IQuiz;
