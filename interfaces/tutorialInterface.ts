import mongoose from 'mongoose';

interface ISlide {
  title: {
    en: string;
    am: string;
  };
  content: {
    en: string;
    am: string;
  };
  imageUrl: string;
}

export interface ITutorial extends mongoose.Document {
  title: {
    en: string;
    am: string;
  };
  courseId: mongoose.Schema.Types.ObjectId;
  duration: number;
  thumbnail: string;
  description: {
    en: string;
    am: string;
  };
  slides: ISlide[];
  videoUrl: {
    en: string;
    am: string;
  };
  prerequisites?: {
    en: string[];
    am: string[];
  };
  rating?: number;
  views?: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: {
    en: string[];
    am: string[];
  };
  createdAt: Date;
  isActive: boolean;
  slug: string;
}
