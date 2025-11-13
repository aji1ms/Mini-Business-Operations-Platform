import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const StaffProtected = () => {
    const { staff, loading } = useSelector((state) => state.staff);

    if (loading) {
        return <LoadingSpinner />
    }

    if (!staff) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default StaffProtected;