import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    jobPostingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
    },
    role: {
      type: String,
      required: [true, 'Please provide job role'],
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

applicationSchema.index({ studentId: 1, jobPostingId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedDate: -1 });

export default mongoose.model('Application', applicationSchema);
