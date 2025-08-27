import express from 'express';
import {
  createQuizResult,
  getAllQuizResults,
  getQuizResultByQuizId,
} from '../controllers/quizResult.controller';

import {
  allowedToAdminOrEmployee,
  isTheQuizTakenByEmployee,
} from '../middlewares/middlewares';
import {
  protectOwner,
  protectUserCompanyOwner,
  protectUserOwner,
} from '../middlewares/auth.platformOwner.middleware';

const router = express.Router();

router
  .route('/')
  .get(protectOwner, getAllQuizResults)
  // NOTE: this will be upgraded to allow platform owner to take quizes
  // .post(allowedToAdminOrEmployee, isTheQuizTakenByEmployee, createQuizResult);
  .post(allowedToAdminOrEmployee, createQuizResult);

router
  .route('/get-by-quiz-id/:quizId')
  // NOTE; to be updated so that company donot access quizes
  .get(protectUserCompanyOwner, getQuizResultByQuizId);

export default router;
