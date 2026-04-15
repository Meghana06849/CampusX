import Student from '../models/Student.js';
import Application from '../models/Application.js';
import { io } from '../index.js';

export const getAllStudents = async (req, res, next) => {
  try {
    const { branch, year, isPlaced, role } = req.query;
    let filter = { role: role || 'student' };

    if (branch) filter.branch = branch;
    if (year) filter.year = parseInt(year);
    if (isPlaced !== undefined) filter.isPlaced = isPlaced === 'true';

    const students = await Student.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    const studentIds = students.map((student) => student._id);
    const applicationStats = await Application.aggregate([
      {
        $match: {
          studentId: { $in: studentIds },
        },
      },
      {
        $group: {
          _id: '$studentId',
          applicationsCount: { $sum: 1 },
        },
      },
    ]);

    const applicationStatsMap = applicationStats.reduce((accumulator, item) => {
      accumulator[item._id.toString()] = item.applicationsCount;
      return accumulator;
    }, {});

    const latestApplications = await Application.find({
      studentId: { $in: studentIds },
    })
      .sort({ appliedDate: -1, createdAt: -1 })
      .select('studentId companyName role status appliedDate jobPostingId');

    const latestApplicationsMap = latestApplications.reduce((accumulator, item) => {
      const key = item.studentId.toString();
      if (!accumulator[key]) {
        accumulator[key] = item.toObject();
      }
      return accumulator;
    }, {});

    const studentsWithStatus = students.map((student) => {
      const applicationsCount = applicationStatsMap[student._id.toString()] || 0;
      const latestApplication = latestApplicationsMap[student._id.toString()] || null;

      return {
        ...student.toObject(),
        applicationsCount,
        hasApplied: applicationsCount > 0,
        latestApplicationStatus: latestApplication?.status || 'Not Applied',
        latestApplication,
      };
    });

    const totalStudents = studentsWithStatus.length;
    const placedStudents = studentsWithStatus.filter((s) => s.isPlaced).length;
    const placementPercentage =
      totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      totalStudents,
      placedStudents,
      placementPercentage,
      students: studentsWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const applicationsCount = await Application.countDocuments({
      studentId: student._id,
    });

    const latestApplication = await Application.findOne({
      studentId: student._id,
    })
      .sort({ appliedDate: -1, createdAt: -1 })
      .select('companyName role status appliedDate jobPostingId');

    res.status(200).json({
      success: true,
      student: {
        ...student.toObject(),
        applicationsCount,
        hasApplied: applicationsCount > 0,
        latestApplicationStatus: latestApplication?.status || 'Not Applied',
        latestApplication: latestApplication || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const { name, cgpa, skills, isPlaced } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, cgpa, skills, isPlaced },
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Emit socket event
    io.emit('studentUpdated', student);

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const { name, email, password, branch, year, cgpa, skills } = req.body;

    // Validate input
    if (!name || !email || !password || !branch || !year) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    // Check if user exists
    const userExists = await Student.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const student = await Student.create({
      name,
      email,
      password,
      branch,
      year,
      cgpa: cgpa || 0,
      skills: skills || [],
      role: 'student',
    });

    // Emit socket event
    io.emit('studentAdded', {
      id: student._id,
      name: student.name,
      email: student.email,
      branch: student.branch,
      year: student.year,
    });

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
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

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
