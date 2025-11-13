# 🚀 Mini Business Operations Platform (M-BOP)

<div align="center">

![M-BOP Banner](https://img.shields.io/badge/M--BOP-Business%20Operations-667eea?style=for-the-badge)

**A lightweight yet scalable business workflow system designed to manage clients, projects, tasks, user roles, and internal activity logs.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=flat-square&logo=vercel)](https://mini-business-operations-platform.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend-API-blue?style=flat-square&logo=render)](https://m-bop-backend.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/aji1ms/Mini-Business-Operations-Platform)

</div>

---

## 📌 Overview

The **Mini Business Operations Platform (M-BOP)** is built to simulate a real business environment with essential operational modules. This project was developed as part of a **Senior Full Stack Developer evaluation assignment**.

### Key Capabilities

- 🔐 **User Authentication** with JWT
- 👥 **Role-Based Access Control** (Admin / Staff)
- 📋 **Client Management** with status tracking
- 📊 **Project & Task Management** with assignments
- 📝 **Activity Logs** for audit trails
- 📈 **Dashboard Metrics** for quick insights

---

## 🏗 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-RTK-764ABC?style=flat-square&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite&logoColor=white)

- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS 4** - Styling framework

### Backend
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Server-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=flat-square&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens&logoColor=white)

- **Node.js 18** - Runtime environment
- **Express.js** - Web framework
- **MongoDB 6.0** - Database
- **Mongoose ODM** - Object modeling
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Deployment
- **Frontend:** Vercel 
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 📂 Project Structure

### Frontend
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── redux/           # Redux slices & store
│   ├── utils/           # Helper functions
│   ├── api/             # API service layer
│   └── App.jsx          # Root component
├── public/
├── .env
└── package.json
```

### Backend
```
backend/
├── src/
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── models/          # Mongoose schemas
│   ├── middleware/      # Auth & validation
│   ├── utils/           # Helper functions
│   └── app.js           # Entry point
├── .env
└── package.json
```

---

## 🔑 Environment Variables

### Frontend

Create `.env` in frontend root:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### Backend

Create `.env` in backend root:

```env
PORT=5000
MONGO_URL=mongodb+srv://ajimsismail123_db_user:Ajims%40123@cluster0.6ndke5z.mongodb.net/mbop?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=000e6ea93c76d38207d46ce8a5e044a539756824f14dedd7a4d601aafe53e3e45d299654e34038dab031030aac3fdd085a4f6fe1e21dff8fbfe158ae29dffdb
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /auth/login
    Backend->>Database: Validate user
    Database-->>Backend: User data
    Backend-->>Frontend: Access + Refresh tokens
    Frontend->>Frontend: Store in Redux
    Frontend-->>User: Redirect to dashboard
```

**How it works:**
1. User logs in → receives access + refresh tokens
2. Access token stored in Redux state
3. Protected routes validate auth state
4. Refresh token used to generate new access token on expiry

---

## 📊 Features Implemented

### ✅ Authentication & Authorization
- Login using JWT
- Access + Refresh token management
- Role-based route protection (Admin/Staff)
- Secure password hashing with bcrypt

### ✅ Client Management
- Add, view, update, delete clients
- Status tracking (New, Active, Paused, Closed)
- Client information management

### ✅ Project Management
- Create and manage projects
- Assign developers to projects
- Link projects to clients
- Status updates (New, In Progress, Completed, Paused, Closed)
- Timeline tracking

### ✅ Task Management
- Full CRUD operations
- Assign tasks to team members
- Due dates & priority tracking
- Status management (Pending, In Progress, Completed)

### ✅ Activity Logs
- Automatic logging of all major actions
- User activity tracking
- Audit trail for compliance

### ✅ Dashboard
- Active clients count
- Ongoing projects overview
- Tasks nearing deadlines
- Quick action cards

---

## 🔌 API Documentation

**Base URL:** `https://m-bop-backend.onrender.com`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/staff/register` | User register | ❌ |
| POST | `/staff/login` | User login | ❌ |
| POST | `/staff/logout` | User logout | ✅ |
| GET | `/staff/getInfo` | Get staff info | ✅ |

### Client Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/admin/client` | Get all clients | Admin |
| POST | `/api/admin/client/add` | Create client | Admin |
| PUT | `/api/admin/client/edit/:id` | Update client | Admin |
| DELETE | `/api/admin/client/delete/:id` | Delete client | Admin |

### Project Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/admin/project` | Get all projects | Admin |
| POST | `/api/admin/project/add` | Create project | Admin |
| PUT | `/api/admin/project/edit/:id` | Update project | Admin |
| DELETE | `/api/admin/project/delete/:id` | Delete project | Admin |
| GET | `/api/staff/project` | Get assigned projects | Staff |

### Task Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/admin/task` | Get all tasks | Admin |
| POST | `/api/admin/task/add` | Create task | Admin |
| PUT | `/api/admin/task/edit/:id` | Update task | Admin |
| DELETE | `/api/admin/task/delete/:id` | Delete task | Admin |

### Activity Log Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/admin/activity` | Get activity logs | Admin |

### Dashboard Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard` | Admin dashboard data | Admin |
| GET | `/api/staff/dashboard` | Staff dashboard data | Staff |

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- Git installed

### Backend Setup

```bash
# Clone repository
git clone https://github.com/aji1ms/Mini-Business-Operations-Platform
cd m-bop/backend

# Install dependencies
npm install

# Create .env file and add environment variables
# (See Environment Variables section above)

# Start development server
npm run dev

# Or start production server
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend/buisness-management

# Install dependencies
npm install

# Create .env file and add environment variables
# (See Environment Variables section above)

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

---
## 🧑‍💻 Developer

<div align="center">

**Ajims Ismail**  
*Full Stack Developer (MERN)*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ajims-ismail/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github)](https://github.com/aji1ms)

</div>

---

## 📞 Support

If you have any questions or need support, please:
- Open an issue on GitHub
- Contact via email: aji1ms.dev@example.com

---

<div align="center">

**Made with ❤️ and ☕ by Ajims Ismail**

⭐ Star this repository if you found it helpful!

</div>
