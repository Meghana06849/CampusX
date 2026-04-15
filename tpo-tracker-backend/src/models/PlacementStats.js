import mongoose from 'mongoose';

const placementStatsSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      unique: true,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    placedStudents: {
      type: Number,
      default: 0,
    },
    placementPercentage: {
      type: Number,
      default: 0,
    },
    averageSalary: {
      type: Number,
      default: 0,
    },
    highestSalary: {
      type: Number,
      default: 0,
    },
    numberOfCompanies: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PlacementStats', placementStatsSchema);
