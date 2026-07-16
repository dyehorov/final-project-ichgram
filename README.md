# Ichgram

Ichgram is a fullstack Instagram-inspired social app built with React, Vite, Express, and MongoDB.

The project already includes core social features such as authentication, posts, likes, comments, profile pages, search, and profile editing. Some UI sections are still demo-only and use mock data while the backend for them is not implemented yet.

## Stack

- Frontend: React, Vite, React Router, Redux Toolkit, Axios, React Hook Form
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Multer

## Current Features

- User registration and login
- Protected and public routes
- Persisted auth state with current user hydration
- Home feed with posts
- Create post with image upload
- Like and unlike posts
- Post comments
- Explore page
- User profile page
- Edit profile with avatar upload
- User search
- Follow and unfollow users

## Demo / Mocked Parts

- Messages page currently uses mock data and is present as a UI/demo screen only
- Forgot password is present in the UI, but it should not be treated as a production-ready password reset flow

## Project Structure

```text
.
├── client   # React + Vite frontend
└── server   # Express + MongoDB backend
```

## Local Setup

### 1. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 2. Configure environment variables

Create a `.env` file in `server`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3333
JWT_TOKEN=your_jwt_secret
```

Create a `.env` file in `client`:

```env
VITE_SERVER_API_URL=http://127.0.0.1:3333
```

### 3. Run the backend

```bash
cd server
npm run dev
```

### 4. Run the frontend

```bash
cd client
npm run dev
```

## Available Scripts

### Client

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Server

```bash
npm run dev
npm start
```

## API Overview

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `GET /auth/me`

### Posts

- `GET /posts`
- `GET /posts/user/:userId`
- `POST /posts/create-post`
- `PATCH /posts/:postId/like`
- `GET /posts/:postId/comments`
- `POST /posts/:postId/comments`

### Profile

- `GET /profile/search/users`
- `GET /profile/:userId`
- `PATCH /profile/:userId/follow`
- `PATCH /profile/:userId/edit-profile`

## Notes

- Uploaded files are served from `/uploads`
- The frontend builds successfully in production mode
- Some frontend lint warnings/errors still need cleanup before calling the project fully polished

