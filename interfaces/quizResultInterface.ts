import mongoose from 'mongoose';

interface IAnswer {
  questionId: mongoose.Schema.Types.ObjectId;
  question: {
    en: string;
    am: string;
  };
  selectedAnswer: {
    en: string;
    am: string;
  };
  isCorrect: boolean;
}

interface IQuizResult extends mongoose.Document {
  quizId: mongoose.Schema.Types.ObjectId;
  companyId: mongoose.Schema.Types.ObjectId;
  employeeId: mongoose.Schema.Types.ObjectId;
  courseId: mongoose.Schema.Types.ObjectId;
  tutorialId: mongoose.Schema.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  percentage: number;
  submittedAt: Date;
  durationInSeconds: number;
  feedback?: {
    en: string;
    am: string;
  };
}

export default IQuizResult;
