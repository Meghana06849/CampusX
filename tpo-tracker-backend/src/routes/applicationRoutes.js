import express from 'express';
import {
  getAllApplications,
  createApplication,
  updateApplication,
  getApplicationById,
  deleteApplication,
  getCompanyStats,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllApplications);
router.post('/', protect, createApplication);
router.get('/company-stats', protect, getCompanyStats);
router.get('/:id', protect, getApplicationById);
router.put('/:id', protect, authorize('admin'), updateApplication);
router.delete('/:id', protect, authorize('admin'), deleteApplication);

export default router;
