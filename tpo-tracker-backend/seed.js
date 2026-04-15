import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = `http://localhost:${process.env.PORT || 5000}/api`;

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // 1. Register demo student user
    console.log('Creating demo student...');
    const studentRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'Raj Kumar',
      email: 'student@demo.com',
      password: 'password123',
      branch: 'CSE',
      year: 4,
      cgpa: 8.5,
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    });
    const studentId = studentRes.data.student.id;
    console.log('✓ Student created:', studentRes.data.student.name);

    // 2. Register demo admin user
    console.log('Creating demo admin...');
    const adminRes = await axios.post(`${API_URL}/auth/register`, {
      name: 'TPO Admin',
      email: 'admin@demo.com',
      password: 'password123',
      branch: 'CSE',
      year: 4,
      cgpa: 9.0,
      role: 'admin',
    });
    const adminToken = adminRes.data.token;
    console.log('✓ Admin created:', adminRes.data.student.name);

    // 3. Create more sample students
    console.log('Creating more students...');
    const studentsData = [
      {
        name: 'Priya Singh',
        email: 'priya@demo.com',
        password: 'password123',
        branch: 'ECE',
        year: 4,
        cgpa: 8.8,
        skills: ['Python', 'Machine Learning', 'TensorFlow'],
      },
      {
        name: 'Amit Patel',
        email: 'amit@demo.com',
        password: 'password123',
        branch: 'ME',
        year: 3,
        cgpa: 7.9,
        skills: ['CAD', 'Simulation'],
      },
      {
        name: 'Sarah Khan',
        email: 'sarah@demo.com',
        password: 'password123',
        branch: 'CSE',
        year: 4,
        cgpa: 9.2,
        skills: ['Java', 'Spring Boot', 'Microservices'],
      },
    ];

    for (const studentData of studentsData) {
      const res = await axios.post(`${API_URL}/auth/register`, studentData);
      console.log('✓ Student created:', res.data.student.name);
    }

    // 4. Create applications
    console.log('Creating applications...');
    const applicationsData = [
      {
        studentId,
        companyName: 'Google',
        role: 'Software Engineer',
        salary: 1500000,
        location: 'Bangalore',
      },
      {
        studentId,
        companyName: 'Microsoft',
        role: 'Software Developer',
        salary: 1400000,
        location: 'Hyderabad',
      },
      {
        studentId,
        companyName: 'Amazon',
        role: 'SDE-1',
        salary: 1300000,
        location: 'Bangalore',
      },
    ];

    for (const appData of applicationsData) {
      const res = await axios.post(`${API_URL}/applications`, appData);
      console.log('✓ Application created:', appData.companyName);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nDemo Credentials:');
    console.log('Student Email: student@demo.com');
    console.log('Password: password123');
    console.log('\nAdmin Email: admin@demo.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('❌ Seeding failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

seedData();
