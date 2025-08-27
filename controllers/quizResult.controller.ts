import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import dbFactory from '../dbOperations/dbFactory';
import QuizResult from '../model/quizResultModel';
import Quiz from '../model/quizModel';
import Course from '../model/courseModel';
import Tutorial from '../model/tutorialModel';
import User from '../model/userModel';
import { catchAsync } from '../utilities/catchAsync';
import { AppError } from '../utilities/appError';

export const getAllQuizResults = dbFactory.getAll(QuizResult);
export const getQuizResult = dbFactory.getOne(QuizResult);

export const getQuizResultByQuizId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { quizId } = req.params;
    const quizResult = await QuizResult.find({ quizId });
    res.status(200).json({
      status: 'success',
      data: {
        document: quizResult,
      },
    });
  },
);

export const getUserQuizProgress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, tutorialId } = req.params;
    const user = req.user;

    if (!user) {
      return next(new AppError('User not authenticated', 401));
    }

    // Get user's learning progress for this course
    const courseProgress = user.learningProgress.find(
      (p) => p.courseId.toString() === courseId,
    );

    if (!courseProgress) {
      return res.status(200).json({
        status: 'success',
        data: {
          courseProgress: 0,
          tutorialProgress: 0,
          quizzes: [],
          courseCompleted: false,
          tutorialCompleted: false,
        },
      });
    }

    // Get tutorial progress if tutorialId is provided
    let tutorialProgress = null;
    if (tutorialId) {
      tutorialProgress = courseProgress.tutorials.find(
        (t) => t.tutorialId.toString() === tutorialId,
      );
    }

    // Get all quizzes for this tutorial
    const tutorialQuizzes = tutorialId ? await Quiz.find({ tutorialId }) : [];

    // Get quiz results for this user and tutorial
    const quizResults = tutorialId
      ? await QuizResult.find({
          employeeId: user._id,
          tutorialId,
        }).populate('quizId')
      : [];

    res.status(200).json({
      status: 'success',
      data: {
        courseProgress: courseProgress.progress,
        courseCompleted: courseProgress.progress >= 100,
        tutorialProgress: tutorialProgress?.progress || 0,
        tutorialCompleted: tutorialProgress?.isCompleted || false,
        quizzes: tutorialQuizzes.map((quiz) => {
          const result = quizResults.find(
            (r) => r.quizId.toString() === (quiz._id as any).toString(),
          );
          return {
            quizId: quiz._id,
            title: quiz.title,
            completed: !!result,
            score: result?.score || 0,
            percentage: result?.percentage || 0,
            isPassed: (result?.percentage || 0) >= 70,
            attempts: result ? 1 : 0,
            completedAt: result?.submittedAt,
          };
        }),
      },
    });
  },
);
// export const createQuizResult = dbFactory.createOne(QuizResult);

// export const updateQuizResult = dbFactory.updateOne(QuizResult);
// export const deleteQuizResult = dbFactory.deleteOne(QuizResult);

export const createQuizResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { quizId, courseId, tutorialId, answers, durationInSeconds } =
      req.body;

    if (!quizId || !courseId || !tutorialId) {
      return next(
        new AppError('Quiz ID, Course ID, and Tutorial ID are required', 400),
      );
    }

    const user = req.user;
    if (!user) {
      return next(new AppError('User not authenticated', 401));
    }

    // Get the quiz to validate and calculate score
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return next(new AppError('Quiz not found', 404));
    }

    // Calculate score and percentage
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    answers.forEach((answer: any, index: number) => {
      const question = quiz.questions[index];
      if (question) {
        const isCorrect =
          question.correctAnswer.en === answer.selectedAnswer.en ||
          question.correctAnswer.am === answer.selectedAnswer.am;
        answer.isCorrect = isCorrect;
        if (isCorrect) correctAnswers++;
      }
    });

    const score = correctAnswers;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Upsert quiz result: update if exists, otherwise create
    const quizResult = await QuizResult.findOneAndUpdate(
      {
        quizId,
        employeeId: user._id,
        tutorialId,
        courseId,
      },
      {
        $set: {
          answers,
          score,
          percentage,
          durationInSeconds,
          submittedAt: new Date(),
        },
        $setOnInsert: {
          companyId: user.companyId,
          quizId,
          employeeId: user._id,
          tutorialId,
          courseId,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    // Update user learning progress (pass score, not percentage)
    await updateUserLearningProgress(
      (user._id as any).toString(),
      courseId,
      tutorialId,
      quizId,
      score, // pass raw score
      totalQuestions, // pass total questions for percentage calculation
    );
    const document = {
      quizResult,
      score,
      percentage,
      totalQuestions,
      correctAnswers,
    };

    res.status(201).json({
      status: 'success',
      data: document,
    });
  },
);

/**
 * Updates user learning progress based on quiz completion
 */
const updateUserLearningProgress = async (
  userId: string,
  courseId: string,
  tutorialId: string,
  quizId: string,
  quizScore: number,
  totalQuestions: number,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  // Find or create course progress
  let courseProgress = user.learningProgress.find(
    (p) => p.courseId.toString() === courseId,
  );

  if (!courseProgress) {
    user.learningProgress.push({
      courseId: new Types.ObjectId(courseId),
      tutorials: [],
      quizzes: [],
      startedAt: new Date(),
      progress: 0,
    });
    courseProgress = user.learningProgress.find(
      (p) => p.courseId.toString() === courseId,
    );
  }
  if (!courseProgress)
    throw new AppError('Failed to create course progress', 500);

  // Find or create tutorial progress
  let tutorialProgress = courseProgress.tutorials.find(
    (t) => t.tutorialId.toString() === tutorialId,
  );

  if (!tutorialProgress) {
    courseProgress.tutorials.push({
      tutorialId: new Types.ObjectId(tutorialId),
      isCompleted: false,
      progress: 0,
      lastWatchedAt: new Date(),
    });
    tutorialProgress = courseProgress.tutorials.find(
      (t) => t.tutorialId.toString() === tutorialId,
    );
  }
  if (!tutorialProgress)
    throw new AppError('Failed to create tutorial progress', 500);

  // Update quiz progress for this tutorial
  let quizProgress = courseProgress.quizzes.find(
    (q) => q.quizId.toString() === quizId,
  );

  if (!quizProgress) {
    courseProgress.quizzes.push({
      quizId: new Types.ObjectId(quizId),
      score: 0,
      attempts: 0,
      isPassed: false,
      completedAt: undefined,
    });
    quizProgress = courseProgress.quizzes.find(
      (q) => q.quizId.toString() === quizId,
    );
  }

  // Now update the quiz progress
  if (quizProgress) {
    quizProgress.attempts += 1;
    quizProgress.score = Math.max(quizProgress.score || 0, quizScore);
    // Calculate percentage for pass/fail
    const percentage =
      totalQuestions > 0 ? (quizProgress.score / totalQuestions) * 100 : 0;
    quizProgress.isPassed = percentage >= 70; // Assuming 70% is passing
    if (quizProgress.isPassed) {
      quizProgress.completedAt = new Date();
    }
  }

  // Calculate tutorial progress based on completed quizzes
  const tutorial = await Tutorial.findById(tutorialId).populate('quizzes');
  if (!tutorial) throw new AppError('Tutorial not found', 404);
  const tutorialQuizzes = (tutorial.get('quizzes') as any[]) || [];
  const totalQuizzesInTutorial = tutorialQuizzes.length;

  const completedQuizzesInTutorial = courseProgress.quizzes.filter((q) => {
    const quizBelongsToTutorial = tutorialQuizzes.some(
      (tq: any) => (tq._id as any).toString() === q.quizId.toString(),
    );
    return quizBelongsToTutorial && q.isPassed;
  }).length;

  // Update tutorial progress
  tutorialProgress.progress = Math.round(
    (completedQuizzesInTutorial / totalQuizzesInTutorial) * 100,
  );
  tutorialProgress.isCompleted = tutorialProgress.progress >= 100;
  tutorialProgress.lastWatchedAt = new Date();

  // Calculate course progress based on completed tutorials
  const course = await Course.findById(courseId).populate('tutorials');
  if (!course) throw new AppError('Course not found', 404);
  const courseTutorials = (course.get('tutorials') as any[]) || [];
  const totalTutorialsInCourse = courseTutorials.length;

  const completedTutorialsInCourse = courseProgress.tutorials.filter((t) => {
    const tutorialBelongsToCourse = courseTutorials.some(
      (ct: any) => (ct._id as any).toString() === t.tutorialId.toString(),
    );
    return tutorialBelongsToCourse && t.isCompleted;
  }).length;

  // Update course progress
  courseProgress.progress = Math.round(
    (completedTutorialsInCourse / totalTutorialsInCourse) * 100,
  );

  if (courseProgress.progress >= 100) {
    courseProgress.completedAt = new Date();
  }

  user.markModified('learningProgress');
  await user.save({ validateBeforeSave: false });

  return {
    courseId,
    tutorialId,
    quizId,
    tutorialProgress: tutorialProgress.progress,
    courseProgress: courseProgress.progress,
    tutorialCompleted: tutorialProgress.isCompleted,
    courseCompleted: courseProgress.progress >= 100,
  };
};

// /**
//  * Updates tutorial progress and recalculates course completion
//  */
// export const updateTutorialProgress = async ({
//   userId,
//   courseId,
//   tutorialId,
//   watchedPercentage,
// }: {
//   userId: string;
//   courseId: string;
//   tutorialId: string;
//   watchedPercentage: number;
// }) => {
//   const user = await User.findById(userId);
//   if (!user) throw new Error('User not found');

//   const courseProgress = user.learningProgress.find((p) =>
//     p.courseId.equals(courseId),
//   );

//   if (!courseProgress) {
//     throw new Error('No progress found for this course');
//   }

//   const tutorialProgress = courseProgress.tutorials.find((t) =>
//     t.tutorialId.equals(tutorialId),
//   );

//   if (!tutorialProgress) {
//     // If this tutorial is not yet tracked, add it
//     courseProgress.tutorials.push({
//       tutorialId: new Types.ObjectId(tutorialId),
//       watchedPercentage,
//       isCompleted: watchedPercentage >= 90,
//       lastWatchedAt: new Date(),
//     });
//   } else {
//     // Update existing progress
//     tutorialProgress.watchedPercentage = watchedPercentage;
//     tutorialProgress.lastWatchedAt = new Date();
//     tutorialProgress.isCompleted = watchedPercentage >= 90;
//   }

//   // Count how many tutorials exist in this course
//   const totalTutorials = await Tutorial.countDocuments({ courseId });

//   // Count completed tutorials
//   const completedTutorials = courseProgress.tutorials.filter(
//     (t) => t.isCompleted,
//   ).length;

//   // If all tutorials completed, mark course as completed
//   if (completedTutorials === totalTutorials) {
//     courseProgress.completedAt = new Date();
//   }

//   await user.save();
//   return {
//     courseId,
//     completedTutorials,
//     totalTutorials,
//     courseCompleted: completedTutorials === totalTutorials,
//   };
// };
