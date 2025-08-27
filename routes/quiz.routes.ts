import express from 'express';
import {
  createQuiz,
  deleteQuiz,
  getAllQuizzes,
  getQuiz,
  updateQuiz,
} from '../controllers/quiz.controller';
import { protectCompany } from '../middlewares/auth.company.middleware';
import {
  protectOwner,
  protectUserOwner,
} from '../middlewares/auth.platformOwner.middleware';

const router = express.Router();

router
  .route('/')
  .get(protectOwner, getAllQuizzes)
  .post(protectOwner, createQuiz);
// router.route('/get-by-tutorialSlug/:tutorialSlug').get(getQuizByTutorial);

// router.route('/:id').get(getQuiz).patch(updateQuiz).delete(deleteQuiz);

export default router;
