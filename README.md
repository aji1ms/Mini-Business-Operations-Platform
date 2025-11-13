🚀 Mini Business Operations Platform (M-BOP)

A lightweight yet scalable business workflow system designed to manage clients, projects, tasks, user roles, and internal activity logs.

Live Demo → Frontend

Backend API → Backend

GitHub → Repository

📌 Overview

The Mini Business Operations Platform (M-BOP) is built to simulate a real business environment with essential operational modules.
This project was developed as part of a Senior Full Stack Developer evaluation assignment.

The platform includes:

User Authentication

Role-Based Access (Admin / Staff)

Client Management

Project & Task Management

Activity Logs

Dashboard Metrics

🏗 Tech Stack
Frontend

React

Redux Toolkit

React Router

Axios

Tailwind CSS

Backend

Node.js

Express.js

MongoDB & Mongoose

JWT Authentication

bcrypt

Hosting

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

📂 Project Structure
Frontend
src/
 ├── components/
 ├── pages/
 ├── redux/
 ├── utils/
 ├── api/
 └── App.jsx

Backend
src/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── utils/
 └── server.js

🔑 Environment Variables
Frontend

Create .env:

VITE_API_URL=https://m-bop-backend.onrender.com

Backend

Create .env:

PORT=4000
MONGO_URI=your_mongo_db_url
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

🔐 Authentication Flow

User logs in → receives access + refresh tokens

Access token stored in Redux state

Protected routes validate auth state

Refresh token used to generate new access token

📊 Features Implemented
✅ Authentication & Authorization

Login using JWT

Access + Refresh tokens

Role-based route protection

✅ Client Management

Add, view, update, delete clients

Status tracking

✅ Project Management

Assign developers

Status updates

Linked to clients

✅ Task Management

CRUD operations

Due dates & status

✅ Activity Logs

Recorded for all major actions

✅ Dashboard

Active clients

Ongoing projects

Tasks nearing deadlines

🔌 API Documentation

Base URL:

https://m-bop-backend.onrender.com

Method	Endpoint	Description
POST	/auth/login	Login user
POST	/auth/refresh	Refresh token
GET	/clients	Get all clients
POST	/clients	Add client
PUT	/clients/:id	Update client
DELETE	/clients/:id	Delete client
POST	/clients/:clientId/projects	Create project
GET	/clients/:clientId/projects	List client projects
POST	/projects/:projectId/tasks	Create task
GET	/projects/:projectId/tasks	List tasks

(More endpoints available in source code.)

🛠 Installation & Setup
Backend
cd backend
npm install
npm run start

Frontend
cd frontend
npm install
npm run dev

🌐 Deployment

Frontend deployed on Vercel

Backend deployed on Render

MongoDB hosted on MongoDB Atlas

📸 Screenshots

(Add your screenshots here later)

✨ Future Improvements

Docker setup

CI/CD pipeline

Unit tests

Role management UI

Better analytics dashboard

🧑‍💻 Developer

Ajims Ismail
Full Stack Developer (MERN)
