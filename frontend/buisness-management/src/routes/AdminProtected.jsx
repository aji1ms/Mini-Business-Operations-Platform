import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminProtected = () => {
    const { admin, loading } = useSelector((state) => state.adminAuth);

    if (loading) {
        return <LoadingSpinner />
    }

    if (!admin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtected;