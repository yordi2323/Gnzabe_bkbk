import mongoose from 'mongoose';

export interface Icourse extends mongoose.Document {
  title: {
    en: string;
    am: string;
  };
  courseCode: string;
  courseDescription: {
    en: string;
    am: string;
  };
  courseLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  // price: {
  //   ETB: number;
  //   USD: number;
  // };
  price: number;
  // companyId: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  isActive: boolean;
  slug: string;
}
