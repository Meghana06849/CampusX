import Student from '../models/Student.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing - cannot issue authentication token');
  }

  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, branch, year, cgpa, role } = req.body;
    const userRole = role || 'student';

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    if (userRole !== 'admin' && (!branch || !year)) {
      return res.status(400).json({
        message: 'Please provide branch and year for student registration',
      });
    }

    // Check if user exists
    const userExists = await Student.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const student = await Student.create({
      name,
      email,
      password,
      branch: userRole === 'admin' ? null : branch,
      year: userRole === 'admin' ? null : year,
      cgpa: cgpa || 0,
      role: userRole,
    });

    const token = generateToken(student._id, student.role);

    res.status(201).json({
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        branch: student.branch,
        year: student.year,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password',
      });
    }

    // Find student and select password
    const student = await Student.findOne({ email }).select('+password');

    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await student.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(student._id, student.role);

    res.status(200).json({
      success: true,
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        branch: student.branch,
        year: student.year,
        cgpa: student.cgpa,
        skills: student.skills,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        branch: student.branch,
        year: student.year,
        cgpa: student.cgpa,
        skills: student.skills,
        isPlaced: student.isPlaced,
      },
    });
  } catch (error) {
    next(error);
  }
};
