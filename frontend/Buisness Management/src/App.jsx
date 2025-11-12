import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import StaffDashboard from "./pages/staff/StaffDashboard";
import Projects from "./pages/admin/Projects";
import Clients from "./pages/admin/Clients";
import ActivityLogs from "./pages/admin/ActivityLogs";
import Members from "./pages/admin/Members";
import { fetchStaff } from "./Redux/slices/staff/staffSlice";
import StaffProtected from "./routes/StaffProtected";
import AdminProtected from "./routes/AdminProtected";
import { fetchAdmin } from "./Redux/slices/admin/adminAuthSlice";
import Tasks from "./pages/admin/Tasks";
import Dashboard from "./pages/admin/Dashboard";
import StaffProject from "./pages/staff/StaffProject";
import StaffTask from "./pages/staff/StaffTask";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStaff())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchAdmin())
  }, [dispatch])

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<StaffProtected />}>
          <Route path="/" element={<StaffDashboard />} />
          <Route path="/staff/projects" element={<StaffProject />} />
          <Route path="/staff/tasks" element={<StaffTask />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminProtected />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/tasks" element={<Tasks />} />
          <Route path="/admin/members" element={<Members />} />
          <Route path="/admin/activitys" element={<ActivityLogs />} />
        </Route>

        <Route path="*" element={<h1 className="text-center mt-20 text-xl">404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
