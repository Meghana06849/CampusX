# TPO Student Tracker - Quick Start Guide

## 📋 Prerequisites

Make sure you have installed:
- Node.js 18+
- MongoDB (local) OR MongoDB Atlas account
- npm or yarn
- Git
- Docker & Docker Compose (optional, for containerized setup)

## 🚀 Quick Start (Local Development)

### Step 1: Clone the Repository

```bash
cd path/to/project
```

### Step 2: Backend Setup

```bash
cd tpo-tracker-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB connection
# For local MongoDB:
# MONGO_URI=mongodb://localhost:27017/tpo-tracker
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tpo-tracker

# Make sure to change JWT_SECRET to something secure
```

### Step 3: Frontend Setup

```bash
cd ../tpo-tracker-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Step 4: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd tpo-tracker-backend
npm run dev
# Backend will run on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd tpo-tracker-frontend
npm run dev
# Frontend will run on http://localhost:3000
```

### Step 5: Access the Application

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000/api/health

### Step 6: Login with Demo Credentials

```
Email: student@demo.com
Password: password123
```

## 🐳 Docker Setup (Recommended)

### Option 1: Docker Compose (All-in-One)

```bash
# From project root directory
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Option 2: Individual Containers

**Build Backend:**
```bash
cd tpo-tracker-backend
docker build -t tpo-backend .
docker run -p 5000:5000 \
  -e MONGO_URI="mongodb://mongodb:27017/tpo-tracker" \
  -e JWT_SECRET="your-secret" \
  tpo-backend
```

**Build Frontend:**
```bash
cd tpo-tracker-frontend
docker build -t tpo-frontend .
docker run -p 3000:3000 tpo-frontend
```

## 📊 Database Setup

### Option 1: MongoDB Local

**Windows:**
1. Download MongoDB Community Edition
2. Install and run MongoDB
3. Use connection string: `mongodb://localhost:27017/tpo-tracker`

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Create database user
5. Get connection string
6. Update `.env` with the connection string

## 🌱 Seed Sample Data

After starting the backend:

```bash
cd tpo-tracker-backend

# Make sure backend is running in another terminal
npm run seed

# OR manually with node
node seed.js
```

This creates:
- 2 sample users (1 student, 1 admin)
- 3 additional students
- 3 sample applications

## 🔑 API Endpoints Reference

### Authentication
```bash
# Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "branch": "CSE",
  "year": 4,
  "cgpa": 8.5
}

# Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Students
```bash
# Get all students
GET http://localhost:5000/api/students
Authorization: Bearer {token}

# Get students with filters
GET http://localhost:5000/api/students?branch=CSE&year=4

# Get student by ID
GET http://localhost:5000/api/students/{id}
```

### Applications
```bash
# Get all applications
GET http://localhost:5000/api/applications

# Create application
POST http://localhost:5000/api/applications
Content-Type: application/json

{
  "studentId": "{studentId}",
  "companyName": "Google",
  "role": "Software Engineer",
  "salary": 1500000,
  "location": "Bangalore"
}

# Update application (Admin only)
PUT http://localhost:5000/api/applications/{id}
Content-Type: application/json

{
  "status": "Selected"
}
```

## 🚀 Deployment

### Deploy to Vercel (Frontend)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repository
5. Select `tpo-tracker-frontend` as root directory
6. Add environment variables:
  - `VITE_API_URL` = Your backend URL with `/api` appended
  - `VITE_SOCKET_URL` = Your backend origin without `/api`
7. Deploy

### Deploy to Render (Backend)

1. Push code to GitHub
2. Go to https://render.com
3. Click "New Web Service"
4. Select your GitHub repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `node src/index.js`
   - Add environment variables
6. Deploy

### MongoDB Atlas

1. No additional setup needed if using MongoDB Atlas
2. Connection string already configured in backend .env

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@demo.com","password":"password123"}'
```

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running
- Check connection string in .env
- Verify port 27017 is available

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 {PID}
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Check `CLIENT_URL` in backend .env
- Ensure it matches your frontend URL

### Socket.IO Connection Failed
```
Socket connection refused
```
**Solution:**
- Ensure backend is running
- Check socket URL in frontend .env
- Verify firewall settings

## 📝 Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/tpo-tracker
JWT_SECRET=your_very_secret_key_change_in_production
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Socket.IO Documentation](https://socket.io/docs/)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the README.md for detailed information
3. Check server logs for error messages
4. Verify environment variables are set correctly

## 📦 Project Structure Summary

```
CampusX/
├── tpo-tracker-backend/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── tpo-tracker-frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🎯 Next Steps

1. ✅ Start the application
2. ✅ Login with demo credentials
3. ✅ Explore the dashboard
4. ✅ Create new students and applications
5. ✅ Test real-time updates
6. ✅ Deploy to production

Happy coding! 🎉
