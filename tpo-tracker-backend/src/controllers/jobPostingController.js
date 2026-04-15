import JobPosting from '../models/JobPosting.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import { io } from '../index.js';

const buildPostingWithStatus = async (jobPosting, studentId = null) => {
  const postingObject = jobPosting.toObject();

  const appliedCount = await Application.countDocuments({
    jobPostingId: jobPosting._id,
  });

  let appliedByMe = false;
  if (studentId) {
    appliedByMe = !!(await Application.findOne({
      jobPostingId: jobPosting._id,
      studentId,
    }));
  }

  return {
    ...postingObject,
    appliedCount,
    appliedByMe,
  };
};

export const getAllJobPostings = async (req, res, next) => {
  try {
    const { company, role, active } = req.query;
    const filter = {};

    if (company) filter.companyName = { $regex: company, $options: 'i' };
    if (role) filter.role = { $regex: role, $options: 'i' };
    if (active !== undefined) filter.isActive = active === 'true';

    const jobPostings = await JobPosting.find(filter)
      .populate('postedBy', 'name email role')
      .sort({ createdAt: -1 });

    const currentUserId = req.user?.id || null;
    const enriched = await Promise.all(
      jobPostings.map((jobPosting) => buildPostingWithStatus(jobPosting, currentUserId))
    );

    res.status(200).json({
      success: true,
      jobPostings: enriched,
    });
  } catch (error) {
    next(error);
  }
};

export const createJobPosting = async (req, res, next) => {
  try {
    const { companyName, role, applicationLink, description, deadline } = req.body;

    if (!companyName || !role || !applicationLink) {
      return res.status(400).json({
        message: 'Please provide companyName, role, and applicationLink',
      });
    }

    const postedBy = await Student.findById(req.user.id);
    if (!postedBy) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobPosting = await JobPosting.create({
      companyName,
      role,
      applicationLink,
      description: description || '',
      deadline: deadline || null,
      postedBy: req.user.id,
    });

    const populatedPosting = await JobPosting.findById(jobPosting._id).populate(
      'postedBy',
      'name email role'
    );

    io.emit('jobPostingCreated', populatedPosting);

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      jobPosting: await buildPostingWithStatus(populatedPosting),
    });
  } catch (error) {
    next(error);
  }
};

export const applyToJobPosting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const jobPosting = await JobPosting.findById(id);
    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    const existingApplication = await Application.findOne({
      studentId,
      jobPostingId: id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: 'You have already applied to this job posting',
      });
    }

    await Application.create({
      studentId,
      jobPostingId: id,
      companyName: jobPosting.companyName,
      role: jobPosting.role,
      status: 'Applied',
      appliedDate: new Date(),
    });

    io.emit('applicationUpdated', {
      type: 'applied',
      jobPostingId: id,
      studentId,
    });

    res.status(201).json({
      success: true,
      message: 'Applied successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobPosting = async (req, res, next) => {
  try {
    const { companyName, role, applicationLink, description, deadline, isActive } =
      req.body;

    const jobPosting = await JobPosting.findByIdAndUpdate(
      req.params.id,
      { companyName, role, applicationLink, description, deadline, isActive },
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email role');

    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    io.emit('jobPostingUpdated', jobPosting);

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      jobPosting: await buildPostingWithStatus(jobPosting),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJobPosting = async (req, res, next) => {
  try {
    const jobPosting = await JobPosting.findByIdAndDelete(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({ message: 'Job posting not found' });
    }

    await Application.deleteMany({ jobPostingId: req.params.id });

    io.emit('jobPostingDeleted', { id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
