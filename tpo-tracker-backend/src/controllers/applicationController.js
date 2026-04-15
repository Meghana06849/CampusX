import Application from '../models/Application.js';
import Student from '../models/Student.js';
import { emitRealtimeEvent } from '../socket/realtime.js';

export const getAllApplications = async (req, res, next) => {
  try {
    const { company, status, studentId } = req.query;
    let filter = {};

    if (company) {
      filter.companyName = { $regex: company, $options: 'i' };
    }
    if (status) {
      filter.status = status;
    }
    if (studentId) {
      filter.studentId = studentId;
    }

    const applications = await Application.find(filter)
      .populate('studentId', 'name email branch cgpa')
      .sort({ appliedDate: -1 });

    // Calculate stats
    const stats = {
      total: applications.length,
      applied: applications.filter((a) => a.status === 'Applied').length,
      interview: applications.filter((a) => a.status === 'Interview').length,
      selected: applications.filter((a) => a.status === 'Selected').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length,
    };

    res.status(200).json({
      success: true,
      stats,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

export const createApplication = async (req, res, next) => {
  try {
    const { studentId, companyName, role, salary, location } = req.body;

    // Validate input
    if (!studentId || !companyName || !role) {
      return res.status(400).json({
        message: 'Please provide studentId, companyName, and role',
      });
    }

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check for duplicate application
    const existingApp = await Application.findOne({
      studentId,
      companyName,
    });
    if (existingApp) {
      return res.status(400).json({
        message: 'Student already has an application for this company',
      });
    }

    const application = await Application.create({
      studentId,
      companyName,
      role,
      salary: salary || null,
      location: location || null,
    });

    const populatedApp = await Application.findById(application._id).populate(
      'studentId',
      'name email branch cgpa'
    );

    // Emit socket event
    emitRealtimeEvent('applicationUpdated', {
      type: 'created',
      application: populatedApp,
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      application: populatedApp,
    });
  } catch (error) {
    next(error);
  }
};

export const updateApplication = async (req, res, next) => {
  try {
    const { status, notes, salary } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, notes, salary },
      { new: true, runValidators: true }
    ).populate('studentId', 'name email branch cgpa');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update student isPlaced status if selected
    if (status === 'Selected') {
      await Student.findByIdAndUpdate(application.studentId._id, {
        isPlaced: true,
      });
    }

    // Emit socket event
    emitRealtimeEvent('applicationUpdated', {
      type: 'updated',
      application,
    });

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      'studentId',
      'name email branch cgpa'
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Emit socket event
    emitRealtimeEvent('applicationUpdated', {
      type: 'deleted',
      applicationId: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getCompanyStats = async (req, res, next) => {
  try {
    const stats = await Application.aggregate([
      {
        $match: { status: 'Selected' },
      },
      {
        $group: {
          _id: '$companyName',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' },
          maxSalary: { $max: '$salary' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
