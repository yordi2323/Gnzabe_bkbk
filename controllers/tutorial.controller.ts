import dbFactory from '../dbOperations/dbFactory';
import Tutorial from '../model/tutorialModel';

export const getAllTutorials = dbFactory.getAll(Tutorial);
export const getTutorial = dbFactory.getOne(Tutorial, { path: 'quizzes' });
export const createTutorial = dbFactory.createOne(Tutorial, [
  'createdAt',
  'isActive',
]);
export const updateTutorial = dbFactory.updateOne(Tutorial);
export const deleteTutorial = dbFactory.deleteOne(Tutorial);
