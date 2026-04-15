import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide job role'],
      trim: true,
    },
    applicationLink: {
      type: String,
      required: [true, 'Please provide application link'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

jobPostingSchema.index({ companyName: 1, role: 1 });
jobPostingSchema.index({ deadline: 1 });

export default mongoose.model('JobPosting', jobPostingSchema);
