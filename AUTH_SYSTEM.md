# Authentication System

## Overview
A complete user login and registration system for GeoCities Reborn.

## Features
- User registration with username, email, and password
- Secure password hashing using bcryptjs
- JWT token-based authentication
- Login/logout functionality
- Protected routes support
- User session persistence

## Backend Endpoints

### Register
- **POST** `/api/auth/register`
- Body: `{ username, email, password }`
- Returns: `{ user }`

### Login
- **POST** `/api/auth/login`
- Body: `{ username, password }`
- Returns: `{ user, token }`

### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

## Frontend Routes
- `/login` - Login page
- `/register` - Registration page
- `/` - Home page (shows login/logout buttons)

## Usage

### Starting the Backend
```bash
cd backend
npm run dev
```

### Starting the Frontend
```bash
cd frontend
npm run dev
```

## Authentication Flow
1. User registers with username, email, and password
2. Password is hashed and stored securely
3. User logs in with username/email and password
4. Server returns JWT token
5. Token is stored in localStorage
6. Token is sent with protected API requests
7. User can logout to clear session

## Security Features
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Protected routes require valid token
- User passwords never returned in API responses

## Data Storage
- Users stored in: `backend/data/users.json`
- Sites stored in: `backend/data/sites/`
