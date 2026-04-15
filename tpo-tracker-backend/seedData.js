import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import database and Student model
import connectDB from './src/config/database.js';
import Student from './src/models/Student.js';

// Connect to database
await connectDB();

// Create demo users
const demoUsers = [
  {
    name: 'Raj Kumar',
    email: 'student@demo.com',
    password: 'password123',
    branch: 'CSE',
    year: 4,
    cgpa: 8.5,
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    role: 'student',
  },
  {
    name: 'TPO Admin',
    email: 'admin@demo.com',
    password: 'password123',
    branch: 'CSE',
    year: 4,
    cgpa: 9.0,
    role: 'admin',
  },
  {
    name: 'Priya Singh',
    email: 'priya@demo.com',
    password: 'password123',
    branch: 'ECE',
    year: 4,
    cgpa: 8.8,
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    role: 'student',
  },
];

try {
  console.log('Starting data seeding...\n');

  for (const userData of demoUsers) {
    try {
      // Check if user already exists
      const existingUser = await Student.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await Student.create(userData);
        console.log(`✅ Created user: ${user.name} (${user.email})`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    } catch (error) {
      console.log(`❌ Error creating ${userData.email}:`, error.message);
    }
  }

  console.log('\n✅ Seeding completed!');
  console.log('\nDemo Credentials:');
  console.log('Student: student@demo.com / password123');
  console.log('Admin: admin@demo.com / password123');
  console.log('Student 2: priya@demo.com / password123');

  process.exit(0);
} catch (error) {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}
