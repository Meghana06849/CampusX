# TPO Student Tracker - Deployment Guide

This guide covers deploying TPO Student Tracker to production on multiple platforms.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database is set up (MongoDB Atlas)
- [ ] JWT_SECRET changed to a secure value
- [ ] Frontend and backend URLs match
- [ ] Code pushed to GitHub
- [ ] All tests passing
- [ ] Error handling implemented
- [ ] CORS configured correctly

## Architecture Overview

```
┌─────────────────┐
│   Vercel CDN    │
│   (Frontend)    │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────────────────────────────────────┐
│              Browser / Client                    │
└─────────────────────────────────────────────────┘
         │ HTTP/WebSocket
         ▼
┌─────────────────────────────────────────────────┐
│     Render / Railway / Heroku                    │
│     (Node.js Backend Server)                    │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│     MongoDB Atlas Cloud Database                │
└─────────────────────────────────────────────────┘
```

## 1. Backend Deployment to Render

### Step 1: Prepare Backend

1. **Ensure all files are committed to GitHub**
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

2. **Update backend package.json**
   - Ensure all dependencies are in `dependencies` (not `devDependencies`)
   - Except: `nodemon` should be in `devDependencies`

3. **Verify .env.example exists** with all required variables

### Step 2: Create Render Account

1. Go to https://render.com
2. Sign up with GitHub account
3. Connect GitHub repository

### Step 3: Create Web Service

1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `tpo-tracker-backend`
   - **Root Directory**: `tpo-tracker-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`

### Step 4: Add Environment Variables

In Render dashboard, add:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tpo-tracker
JWT_SECRET=your_production_secret_key_here
NODE_ENV=production
PORT=10000
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Step 5: Deploy

- Click "Create Web Service"
- Render will automatically deploy
- Get your backend URL (e.g., https://tpo-tracker-backend.onrender.com)

## 2. Frontend Deployment to Vercel

### Step 1: Prepare Frontend

1. **Ensure all files are in git**
   ```bash
   git add .
   git commit -m "Prepare frontend for deployment"
   git push origin main
   ```

2. **Update .env.example**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel app

### Step 3: Import Project

1. Click "New Project"
2. Import GitHub repository
3. Select `tpo-tracker-frontend` as root directory

### Step 4: Configure Environment

Set environment variables:
```
VITE_API_URL=https://your-render-backend-url/api
VITE_SOCKET_URL=https://your-render-backend-url
```

### Step 5: Deploy

- Click "Deploy"
- Vercel handles the build automatically
- Get your frontend URL (e.g., https://tpo-tracker.vercel.app)

## 3. Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier available)
3. Create organization

### Step 2: Create Cluster

1. Click "Create a Deployment"
2. Choose "M0 Free" for development
3. Select cloud provider and region
4. Click "Create Cluster"
5. Wait for cluster to be created (2-3 minutes)

### Step 3: Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Set username and password
4. Grant admin access
5. Create user

### Step 4: Get Connection String

1. Go to "Databases"
2. Click "Connect"
3. Choose "Drivers"
4. Copy connection string
5. Replace `<password>` with your password
6. Add to backend .env as `MONGO_URI`

### Step 5: Allow Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

## 4. Production Configuration

### Backend Production Setup

```javascript
// src/index.js - Add in production

if (process.env.NODE_ENV === 'production') {
  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}
```

### SSL/TLS Certificate

- Vercel: Automatic (Let's Encrypt)
- Render: Automatic (Let's Encrypt)
- MongoDB Atlas: Automatic

### CORS Configuration for Production

```javascript
// Backend - Update CORS settings
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      'https://your-frontend-url.vercel.app'
    ],
    credentials: true,
  })
);
```

## 5. Monitoring & Logs

### Render Logs

1. Go to Render dashboard
2. Select your service
3. Click "Logs" tab
4. View real-time logs

### Vercel Analytics

1. Go to Vercel dashboard
2. Select your project
3. View Analytics tab
4. Monitor performance metrics

### MongoDB Monitoring

1. Go to MongoDB Atlas
2. Click "Monitoring" tab
3. View database performance
4. Check slow queries

## 6. Continuous Integration/Deployment

### GitHub Actions Setup

The `.github/workflows/ci-cd.yml` file includes:
- Automated tests on push
- Build verification
- Auto-deployment on push to main

**To enable auto-deployment:**

1. Add Render API key to GitHub secrets
   - Settings → Secrets and variables → Actions
   - Add `RENDER_API_KEY`

2. Add Vercel token to GitHub secrets
   - Add `VERCEL_TOKEN`
   - Add `VERCEL_ORG_ID`
   - Add `VERCEL_PROJECT_ID`

## 7. Post-Deployment

### Health Checks

```bash
# Check backend health
curl https://your-backend-url/api/health

# Check frontend accessibility
curl https://your-frontend-url
```

### Verify Functionality

1. **Login Test**
   - Navigate to frontend
   - Login with demo credentials
   - Should redirect to dashboard

2. **API Test**
   ```bash
   curl -X GET https://your-backend-url/api/students \
     -H "Authorization: Bearer {token}"
   ```

3. **Socket.IO Test**
   - Open browser DevTools
   - Check Console tab
   - Should see "Socket connected"

### Create Admin Backup

1. Register a backup admin account
2. Store credentials securely
3. Use only in emergencies

## 8. Troubleshooting Production

### Backend Won't Connect to Database
```
Error: connect ECONNREFUSED
```
**Solution:**
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas
- Increase connection pool size

### Frontend Can't Connect to Backend
```
Error: Failed to fetch from API
```
**Solution:**
- Verify VITE_API_URL is correct
- Check CORS configuration
- Verify backend is running

### Socket.IO Real-Time Updates Not Working
```
Socket connection refused
```
**Solution:**
- Ensure VITE_SOCKET_URL matches backend URL
- Check firewall allows WebSocket connections
- Enable WebSocket support in proxy

### High Latency Issues
```
Slow API responses
```
**Solution:**
- Check MongoDB indexes
- Add application caching
- Use CDN for static assets
- Scale backend resources

## 9. Backup & Recovery

### Database Backup

**MongoDB Atlas Automatic Backups:**
1. Go to "Backup" tab
2. Configure retention policy
3. Store backups in S3 (optional)

**Manual Backup:**
```bash
# Export database
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/tpo-tracker"

# Restore database
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net" dump/
```

### Code Backup

```bash
# Create release tag
git tag -a v1.0.0 -m "Production Release v1.0.0"
git push origin v1.0.0

# Keep GitHub repo updated
git push origin main
```

## 10. Maintenance

### Regular Tasks

- [ ] Check error logs weekly
- [ ] Monitor database performance
- [ ] Update dependencies monthly
- [ ] Review security alerts
- [ ] Test disaster recovery

### Updates & Patches

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Test updates locally
npm install
npm run dev

# Merge and deploy
git add .
git commit -m "Update dependencies"
git push origin main
```

## Cost Estimation

### Free Tier (Suitable for Development)

- **Vercel**: 50 GB bandwidth/month
- **Render**: 750 hours/month
- **MongoDB Atlas**: 512 MB storage
- **Total Cost**: $0/month

### Paid Tier (Suitable for Production)

| Service | Plan | Cost/Month |
|---------|------|-----------|
| Vercel | Pro | $20 |
| Render | Professional | $12-50 |
| MongoDB Atlas | M10 | $57 |
| **Total** | | **~$100** |

## Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database password is strong
- [ ] HTTPS enabled everywhere
- [ ] CORS configured properly
- [ ] SQL/NoSQL injection prevented
- [ ] Rate limiting configured
- [ ] Sensitive data not logged
- [ ] Environment variables used
- [ ] Regular security audits scheduled
- [ ] Disaster recovery plan documented

## Support & Documentation

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Deployment Guide](https://expressjs.com/en/guide/deployment/production.html)

## Rollback Procedure

If deployment fails:

1. **Vercel Rollback**
   - Go to Deployments
   - Click three dots on previous deployment
   - Select "Rollback"

2. **Render Rollback**
   - Go to Service
   - Find previous working build
   - Click "Deploy"

3. **Database Rollback**
   - Restore from backup
   - Test in staging first
   - Deploy to production

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Configure MongoDB Atlas
4. ✅ Set up monitoring and logs
5. ✅ Test all functionality
6. ✅ Configure domain names (optional)
7. ✅ Set up SSL/TLS certificates
8. ✅ Enable analytics and metrics
9. ✅ Document API endpoints
10. ✅ Plan scaling strategy

Congratulations! Your TPO Student Tracker is now live in production! 🎉
