import dbFactory from '../dbOperations/dbFactory';
import Quiz from '../model/quizModel';

export const getAllQuizzes = dbFactory.getAll(Quiz);
export const getQuiz = dbFactory.getOne(Quiz);
export const createQuiz = dbFactory.createOne(Quiz);
export const updateQuiz = dbFactory.updateOne(Quiz);
export const deleteQuiz = dbFactory.deleteOne(Quiz);
