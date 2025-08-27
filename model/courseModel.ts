import mongoose, { Model, Schema } from 'mongoose';
import slugify from 'slugify';
import { Icourse } from '../interfaces/courseInterface';
import { cloudConnection } from '../config/dbConfig';

const courseSchema: Schema<Icourse> = new mongoose.Schema<Icourse>(
  {
    title: {
      en: {
        type: String,
        required: [true, 'Title (English) is required'],
        trim: true,
        unique: true,
      },
      am: {
        type: String,
        required: [true, 'Title (Amharic) is required'],
        trim: true,
        unique: true,
      },
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      trim: true,
    },
    courseDescription: {
      en: {
        type: String,
        required: [true, 'Description (English) is required'],
        trim: true,
      },
      am: {
        type: String,
        required: [true, 'Description (Amharic) is required'],
        trim: true,
      },
    },
    courseLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
    },
    // price: {
    //   ETB: {
    //     type: Number,
    //     required: true,
    //     min: 0,
    //   },
    //   USD: {
    //     type: Number,
    //     required: true,
    //     min: 0,
    //   },
    // },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },

    // companyId: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Company',
    //     required: [true, 'Company ID is required'],
    //   },
    // ],

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

courseSchema.virtual('tutorials', {
  ref: 'Tutorial',
  foreignField: 'courseId',
  localField: '_id',
});

courseSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title.en, { lower: true });
  }
  next();
});

const Course: Model<Icourse> = cloudConnection.model<Icourse>(
  'Course',
  courseSchema,
);

export default Course;
