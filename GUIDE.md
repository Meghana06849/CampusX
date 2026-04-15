# 🚀 TPO Student Tracker - Ready to Use!

## ✅ Status

| Component | Status | URL |
|-----------|--------|-----|
| Backend | ✅ Running | http://localhost:5000 |
| Frontend | ✅ Running | http://localhost:5173 |
| MongoDB | ✅ Connected | localhost:27017 |

---

## 🔐 Demo Login Accounts

### Student Account
```
Email: student@demo.com
Password: password123
```

### Admin Account  
```
Email: admin@demo.com
Password: password123
```

### Additional Student
```
Email: priya@demo.com
Password: password123
```

---

## 🎯 Features to Test

### 1. **Login Page**
   - Enter email and password
   - Click "Login" button
   - Should redirect to Dashboard on success

### 2. **Dashboard**
   - View placement statistics
   - See charts for application status
   - View top hiring companies
   - Real-time update indicators

### 3. **Students Page**
   - View all registered students
   - Filter by branch (CSE, ECE, ME, CE, EEE, BT)
   - Filter by year (1, 2, 3, 4)
   - Search by name or email
   - View student details

### 4. **Applications Page**
   - Create new job applications
   - Update application status (Applied → Interview → Selected → Rejected)
   - Filter applications by company and status
   - Search by company name or student
   - Edit or delete applications

### 5. **Real-Time Updates**
   - Create a new application
   - Open dashboard in another tab
   - Notification updates automatically (no refresh needed!)

---

## 🔄 Admin vs Student Features

### Admin Can:
- ✅ Manage all student accounts
- ✅ Update application statuses
- ✅ Delete records
- ✅ View all statistics
- ✅ Access all students' applications

### Student Can:
- ✅ View own profile
- ✅ Create applications
- ✅ View their applications
- ✅ See placement statistics
- ❌ Cannot manage other students
- ❌ Cannot delete applications

---

## 📱 How to Create an Account

1. Go to http://localhost:5173
2. Click "Register here" link on login page
3. Fill in the form:
   - Name
   - Email
   - Password
   - Branch (CSE, ECE, ME, CE, EEE, BT)
   - Year (1, 2, 3, 4)
   - CGPA (optional)
   - Skills (optional, comma-separated)
4. Click "Register"
5. Login with your credentials

---

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Check Tailwind styling
- **Real-Time Charts**: Pie charts and bar charts with Recharts
- **Instant Feedback**: Error messages show clearly
- **Navigation**: Easy tab switching between pages

---

## 🔧 API Endpoints

### Authentication
```bash
# Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student@demo.com",
  "password": "password123"
}

# Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "your@email.com",
  "password": "password123",
  "branch": "CSE",
  "year": 4,
  "cgpa": 8.5,
  "skills": ["JavaScript", "React"]
}
```

### Students
```bash
# Get all students
GET http://localhost:5000/api/students
Authorization: Bearer {token}

# Filter students
GET http://localhost:5000/api/students?branch=CSE&year=4
```

### Applications
```bash
# Get all applications
GET http://localhost:5000/api/applications

# Create application
POST http://localhost:5000/api/applications
{
  "studentId": "{id}",
  "companyName": "Google",
  "role": "Software Engineer",
  "salary": 1500000,
  "location": "Bangalore"
}

# Update status
PUT http://localhost:5000/api/applications/{id}
{
  "status": "Selected"
}
```

---

## 🐛 Troubleshooting

### Login not working?
- Verify credentials are correct
- Check browser console for error messages
- Ensure backend is running (you should see "Server running on port 5000")

### Dashboard not loading?
- Refresh the page (F5)
- Check if backend is responding: http://localhost:5000/api/health
- Look at browser console for network errors

### Real-time updates not working?
- Open browser console
- You should see "Socket connected" message
- Check if backend is running

### Application creation fails?
- Ensure you're logged in
- Verify all required fields are filled
- Check browser console for detailed error

---

## 💾 Database

- **Type**: MongoDB
- **Location**: localhost:27017 (local) or MongoDB Atlas (cloud)
- **Database Name**: tpo-tracker
- **Collections**: Students, Applications

To view data in MongoDB:
```bash
mongosh
use tpo-tracker
db.students.find()
db.applications.find()
```

---

## 🚀 Next Steps

1. **Test Student Flow**
   - Login as student@demo.com
   - View dashboard
   - Create an application
   - See update in real-time

2. **Test Admin Flow**
   - Login as admin@demo.com
   - View all students
   - Update application status
   - See stats change

3. **Test Multi-Tab**
   - Open dashboard in one tab
   - Create application in another
   - Watch updates in real-time

4. **Create Custom Account**
   - Use register page to create your own account
   - Test different roles and features

---

## 📞 Support

If you encounter issues:
1. Check console: F12 → Console tab
2. Check terminal logs
3. Verify both servers are running
4. Ensure MongoDB is running locally
5. Check environment variables in .env files

---

**Happy Testing!** 🎉
