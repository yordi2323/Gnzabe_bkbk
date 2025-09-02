import {Request,Response, NextFunction } from 'express';
import dbFactory from '../dbOperations/dbFactory';
import Tutorial from '../model/tutorialModel';
import { catchAsync } from '../utilities/catchAsync';
import { getQuizResultByQuizId } from './quizResult.controller';

export const getAllTutorials = dbFactory.getAll(Tutorial);
export const getTutorial = dbFactory.getOne(Tutorial, { path: 'quizzes' });
export const createTutorial = dbFactory.createOne(Tutorial, [
  'createdAt',
  'isActive',
]);
export const updateTutorial = dbFactory.updateOne(Tutorial);
export const deleteTutorial = dbFactory.deleteOne(Tutorial);

export const sortTutorials = catchAsync(async(req:Request,res:Response,next:NextFunction
)=>{
 const tutorials = await Tutorial.find(
 ).sort({ slug: 1 });



 console.log(tutorials);





 
   res.status(200).json({
      status: 'success',
      results: tutorials.length,
      data: {
        documents:tutorials,
      },
    });
})
