# TPO Student Tracker

A production-ready full-stack real-time web application for tracking student placements and applications.

[Live Site](https://campus-tpo-frontend.vercel.app/)

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time communication

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **Recharts** - Data visualization
- **React Router** - Navigation

## Features

✅ **User Authentication**
- Register and login functionality
- JWT-based authentication
- Role-based access control (Admin/Student)
- Password hashing with bcryptjs

✅ **Student Management**
- View all students with filtering
- Filter by branch, year, and placement status
- Student profile information
- Skills tracking

✅ **Application Tracking**
- Create and manage job applications
- Track application status (Applied, Interview, Selected, Rejected)
- Filter applications by company and status
- View company-wise hiring statistics

✅ **Real-Time Updates**
- Socket.IO integration for live updates
- Instant notifications when new students are added
- Real-time application status changes
- No page refresh required

✅ **Analytics Dashboard**
- Total students and placement statistics
- Placement percentage
- Application status distribution (Pie Chart)
- Top hiring companies (Bar Chart)
- Company-wise salary statistics

✅ **Responsive Design**
- Mobile-friendly interface
- Tailwind CSS styling
- Sidebar navigation
- Clean, modern UI

## Project Structure

```
tpo-tracker-backend/
├── src/
│   ├── models/
│   │   ├── Student.js
│   │   ├── Application.js
│   │   └── PlacementStats.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   └── applicationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   └── applicationRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── database.js
│   ├── socket/
│   │   └── socketHandler.js
│   └── index.js
├── package.json
├── .env.example
└── Dockerfile

tpo-tracker-frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── StatsCard.jsx
│   │   └── ApplicationTable.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── StudentsPage.jsx
│   │   └── ApplicationsPage.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── socket.js
│   ├── utils/
│   │   ├── auth.js
│   │   └── formatters.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── .env.example
└── Dockerfile
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Students
- `GET /api/students` - Get all students (with filters)
- `POST /api/students` - Create new student (admin only)
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student (admin only)
- `DELETE /api/students/:id` - Delete student (admin only)

### Applications
- `GET /api/applications` - Get all applications (with filters)
- `POST /api/applications` - Create new application
- `GET /api/applications/:id` - Get application by ID
- `PUT /api/applications/:id` - Update application (admin only)
- `DELETE /api/applications/:id` - Delete application (admin only)
- `GET /api/applications/company-stats` - Get company statistics

## Real-Time Events

### Emitted by Server
- `studentAdded` - When a new student is created
- `applicationUpdated` - When an application status changes

### Listen on Client
```javascript
socketService.on('studentAdded', (student) => {
  console.log('New student added:', student);
});

socketService.on('applicationUpdated', (data) => {
  console.log('Application updated:', data);
});
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd tpo-tracker-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tpo-tracker
   JWT_SECRET=your_super_secret_key_here_change_in_production
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the backend server**
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd tpo-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

## Docker Setup

### Using Docker Compose (Recommended)

1. **From project root directory**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`
   - MongoDB: `mongodb://admin:password123@localhost:27017`

3. **Stop containers**
   ```bash
   docker-compose down
   ```

### Individual Docker Containers

**Backend:**
```bash
cd tpo-tracker-backend
docker build -t tpo-backend .
docker run -p 5000:5000 --env-file .env tpo-backend
```

**Frontend:**
```bash
cd tpo-tracker-frontend
docker build -t tpo-frontend .
docker run -p 3000:3000 tpo-frontend
```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create database user
4. Get connection string
5. Update `MONGO_URI` in backend `.env`

### Local MongoDB

```bash
# On Windows
mongod

# On macOS
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

## Demo Credentials

```
Email: student@demo.com
Password: password123
```

To create a demo admin user, modify the Student model to set `role: 'admin'` before first registration, or use the API directly with admin role.

## Deployment

### Vercel (Frontend)

1. Push frontend code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
   - `VITE_API_URL` should end with `/api`
   - `VITE_SOCKET_URL` should be the backend origin without `/api`
4. Deploy

### Render (Backend)

1. Push backend code to GitHub
2. Connect repository to Render
3. Create new Web Service
4. Set environment variables
5. Deploy

### Database (MongoDB Atlas)

Already set up in the configuration with your connection string.

## Key Features Implementation

### Real-Time Updates
The application uses Socket.IO to provide real-time updates:
- When a new student is registered, all connected clients receive `studentAdded` event
- When an application status changes, all clients receive `applicationUpdated` event
- No page refresh needed for immediate updates

### Authentication
- JWT tokens stored in localStorage
- Automatic token inclusion in all API requests
- Protected routes redirect unauthenticated users to login
- Token expiration set to 7 days

### Authorization
- Role-based access control (Admin/Student)
- Admins can manage students and update application statuses
- Students can only view their own applications

### Data Validation
- Backend validates all inputs
- MongoDB schema validation
- Frontend form validation
- Error messages displayed to users

### Performance Optimization
- Debounced search filters
- Lazy loading of data
- Indexed MongoDB queries
- Responsive chart rendering

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check if ports 5000 and 3000 are available
- Verify environment variables are set correctly

### Real-Time Updates Not Working
- Check Socket.IO connection in browser console
- Ensure server is running
- Check CORS settings in backend

### API Errors
- Check network tab in browser DevTools
- Verify JWT token in localStorage
- Check server logs for error messages

## Contributing

Feel free to fork, modify, and improve this project!

## License

MIT License - feel free to use this project for educational and commercial purposes.

## Support

For issues or questions, please create an issue in the repository.
