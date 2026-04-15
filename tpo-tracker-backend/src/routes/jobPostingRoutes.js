import express from 'express';
import {
  getAllJobPostings,
  createJobPosting,
  applyToJobPosting,
  updateJobPosting,
  deleteJobPosting,
} from '../controllers/jobPostingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllJobPostings);
router.post('/', protect, authorize('admin'), createJobPosting);
router.post('/:id/apply', protect, applyToJobPosting);
router.put('/:id', protect, authorize('admin'), updateJobPosting);
router.delete('/:id', protect, authorize('admin'), deleteJobPosting);

export default router;
