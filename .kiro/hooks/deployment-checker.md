---
name: "Pre-Deployment Checker"
description: "Run checks before deploying to production"
trigger: "manual"
enabled: true
---

# Pre-Deployment Checker

Run comprehensive checks before deploying to Railway/Vercel.

## Checklist

### Environment Variables
- [ ] MONGODB_URI is set
- [ ] JWT_SECRET is configured
- [ ] GEMINI_API_KEY is valid
- [ ] DB_NAME is set
- [ ] Production URLs are correct

### Code Quality
- [ ] No TypeScript errors in frontend
- [ ] No console.errors in production code
- [ ] All API endpoints use production URL
- [ ] No hardcoded localhost references
- [ ] All imports are valid

### Features
- [ ] Authentication works (login/register)
- [ ] AI code generation works
- [ ] File operations work (create/edit/delete)
- [ ] Publishing to neighborhoods works
- [ ] Gallery displays sites correctly
- [ ] Profile page shows user sites
- [ ] Edit functionality works
- [ ] Visitor counter increments

### Performance
- [ ] Images are optimized
- [ ] No unnecessary re-renders
- [ ] API calls have error handling
- [ ] Loading states are implemented

### Security
- [ ] JWT tokens are validated
- [ ] Passwords are hashed
- [ ] User input is sanitized
- [ ] CORS is configured correctly
- [ ] API routes are protected

## Instructions

Run through this checklist and report any issues found. Suggest fixes for any problems discovered.
