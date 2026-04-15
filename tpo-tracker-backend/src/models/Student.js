import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    branch: {
      type: String,
      enum: ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'BT'],
      required: function () {
        return this.role !== 'admin';
      },
    },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: function () {
        return this.role !== 'admin';
      },
    },
    cgpa: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    skills: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isPlaced: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
studentSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Match user password
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('Student', studentSchema);
