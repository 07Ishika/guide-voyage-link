# 🚀 Vercel Demo Deployment Guide

## Current Setup
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render (https://guide-voyage-link-1.onrender.com)
- **Database**: MongoDB Atlas
- **Demo Login**: ✅ Configured and ready

## 🎯 Production Demo URLs

### Your Live Demo
- **Main App**: https://guide-voyage-link.vercel.app
- **Role Selection**: https://guide-voyage-link.vercel.app/role
- **Manual Login**: https://guide-voyage-link.vercel.app/manual-login

### Backend API
- **Base URL**: https://guide-voyage-link-1.onrender.com
- **Demo Login**: https://guide-voyage-link-1.onrender.com/auth/demo-login

## 🔧 Ensuring Demo Works in Production

### Step 1: Verify Backend is Running
```bash
curl https://guide-voyage-link-1.onrender.com/health
```

### Step 2: Seed Production Database
```bash
# Set your Atlas connection string
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/voyagery"

# Run the seeding script
node seed-production.js
```

### Step 3: Test Demo Login API
```bash
# Test migrant demo login
curl -X POST https://guide-voyage-link-1.onrender.com/auth/demo-login \
  -H "Content-Type: application/json" \
  -d '{"role": "migrant"}'

# Test guide demo login  
curl -X POST https://guide-voyage-link-1.onrender.com/auth/demo-login \
  -H "Content-Type: application/json" \
  -d '{"role": "guide"}'
```

## 🎨 Demo Flow for Stakeholders

### 1. **Share the Live URL**
Send stakeholders to: https://guide-voyage-link.vercel.app/role

### 2. **Migrant Experience Demo**
1. Click "Demo Login as Migrant"
2. Shows Sarah Chen's dashboard at `/home`
3. Demonstrate: Browse guides, book sessions, view profile

### 3. **Guide Experience Demo**  
1. Click "Demo Login as Guide"
2. Shows Dr. Michael Rodriguez's dashboard at `/home/guide`
3. Demonstrate: Manage sessions, view requests, update profile

### 4. **Key Features to Highlight**
- ✅ Instant login (no Google OAuth needed)
- ✅ Role-based dashboards
- ✅ Pre-populated realistic data
- ✅ Full functionality without setup

## 🔍 Production Troubleshooting

### Issue: "Demo Login Failed"
**Cause**: Demo users don't exist in production database
**Solution**: 
```bash
node seed-production.js
```

### Issue: CORS Errors
**Cause**: Backend not allowing Vercel domain
**Solution**: CORS is already configured for `*.vercel.app` domains

### Issue: Backend Not Responding
**Cause**: Render service may be sleeping
**Solution**: 
- Visit https://guide-voyage-link-1.onrender.com to wake it up
- Render free tier sleeps after inactivity

### Issue: Session Not Persisting
**Cause**: Cookie settings for cross-domain
**Solution**: Already configured with proper session settings

## 📱 Mobile Demo

The demo works perfectly on mobile:
- Responsive design maintained
- Touch-friendly demo buttons
- Proper navigation on all devices

## 🎉 Production Demo Checklist

Before sharing with stakeholders:

- [ ] ✅ Backend is running on Render
- [ ] ✅ Frontend is deployed on Vercel  
- [ ] ✅ Demo users exist in Atlas database
- [ ] ✅ Both migrant and guide demo login work
- [ ] ✅ Navigation to correct dashboards
- [ ] ✅ Profiles show realistic data
- [ ] ✅ Mobile experience tested

## 🚀 Ready to Demo!

Your Voyagery app is production-ready with working demo login:

1. **Share**: https://guide-voyage-link.vercel.app/role
2. **Demo**: Both migrant and guide experiences
3. **Showcase**: Complete platform functionality
4. **No Setup**: Stakeholders can test immediately

The demo login provides an instant way to showcase your platform's value without any barriers to entry!