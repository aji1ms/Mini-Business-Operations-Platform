import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutStaff } from "../../Redux/slices/staff/staffSlice";

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await dispatch(logoutStaff()).unwrap();
            toast.success("Logged out successfully!");
            navigate("/login");
        } catch {
            toast.error("Logout failed!");
        }
    };

    return (
        <div>
            <h1 className='text-3xl font-bold'>Dashboard</h1>
            <button onClick={handleLogout}>logout</button>
        </div>

    )
}

export default Dashboard
