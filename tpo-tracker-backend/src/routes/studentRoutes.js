import express from 'express';
import {
  getAllStudents,
  getStudentById,
  updateStudent,
  createStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllStudents);
router.post('/', protect, authorize('admin'), createStudent);
router.get('/:id', protect, getStudentById);
router.put('/:id', protect, authorize('admin'), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

export default router;
