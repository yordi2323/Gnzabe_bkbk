import express from 'express';

import {
  createTutorial,
  deleteTutorial,
  getAllTutorials,
  getTutorial,
  updateTutorial,
} from '../controllers/tutorial.controller';
import {
  handleVideoUpload,
  uploadTutorialAssets,
} from '../middlewares/videoUpload';
import { resizeThumbnail } from '../middlewares/photoUpload';
import { protectUser } from '../middlewares/auth.user.middleware';
import {
  protectOwner,
  protectUserCompanyOwner,
  protectUserOwner,
} from '../middlewares/auth.platformOwner.middleware';
import { parseSlidesTags } from '../middlewares/middlewares';

const router = express.Router();

router.route('/').get(protectUserCompanyOwner, getAllTutorials).post(
  protectOwner,
  uploadTutorialAssets,
  resizeThumbnail,
  handleVideoUpload,
  parseSlidesTags,
  createTutorial,
);

router.route('/:id').get(protectUserOwner, getTutorial).patch(
  protectOwner,
  uploadTutorialAssets,
  resizeThumbnail,
  handleVideoUpload,
  parseSlidesTags,

  updateTutorial,
);
// .delete(deleteTutorial);

export default router;
