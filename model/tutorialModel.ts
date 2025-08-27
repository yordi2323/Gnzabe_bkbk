import mongoose, { Schema, Model } from 'mongoose';
import slugify from 'slugify';
import { ITutorial } from '../interfaces/tutorialInterface';
import { cloudConnection } from '../config/dbConfig';

const tutorialSchema: Schema<ITutorial> = new mongoose.Schema<ITutorial>(
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
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course ID is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
    },
    description: {
      en: {
        type: String,
        required: [true, 'English description is required'],
      },
      am: {
        type: String,
        required: [true, 'Amharic description is required'],
      },
    },
    // videoUrl: {
    //   type: String,
    //   required: [true, 'Video URL is required'],
    // },
    videoUrl: {
      en: {
        type: String,
        required: [true, 'English video URL is required'],
      },
      am: {
        type: String,
        required: [true, 'Amharic video URL is required'],
      },
    },
    slides: [
      {
        title: {
          en: { type: String, required: false },
          am: { type: String, required: false },
        },
        content: {
          en: { type: String, required: true },
          am: { type: String, required: true },
        },
        imageUrl: { type: String }, // Optional image per slide
      },
    ],
    prerequisites: {
      en: {
        type: [String],
        default: [],
      },
      am: {
        type: [String],
        default: [],
      },
    },
    rating: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    tags: {
      en: {
        type: [String],
        default: [],
      },
      am: {
        type: [String],
        default: [],
      },
    },
    slug: {
      type: String,
      unique: true,
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

tutorialSchema.index({ 'title.en': 1 }, { unique: true, sparse: true });
tutorialSchema.index({ 'title.am': 1 }, { unique: true, sparse: true });

// Pre-save hook to generate slug from English title
tutorialSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title.en, { lower: true });
  }
  next();
});

tutorialSchema.virtual('quizzes', {
  ref: 'Quiz',
  foreignField: 'tutorialId',
  localField: '_id',
});
const Tutorial: Model<ITutorial> = cloudConnection.model<ITutorial>(
  'Tutorial',
  tutorialSchema,
);

console.log('Tutorial model created successfully');
export default Tutorial;
