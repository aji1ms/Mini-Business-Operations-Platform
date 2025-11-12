import { useState, useEffect } from "react";
import { staffNavItems } from "../utils/constants";
import { LogOut, Menu, X, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logoutStaff } from "../Redux/slices/staff/staffSlice";

const StaffSidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await dispatch(logoutStaff()).unwrap();
            toast.success("Logged out successfully!");
            navigate("/login");
        } catch {
            toast.error("Logout failed!");
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition"
            >
                <Menu size={24} />
            </button>

            <aside
                className={`fixed lg:static top-0 left-0 h-screen bg-slate-900 text-white flex flex-col 
        transition-transform duration-300 z-50
                    ${sidebarOpen
                        ? "translate-x-0 w-full sm:w-full"
                        : "-translate-x-full lg:translate-x-0 lg:w-64"
                    }
        lg:w-64
      `}
            >
                <div className="p-4 flex items-center justify-between border-b border-slate-800">
                    <h1 className="text-xl font-bold">M-BOP</h1>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {staffNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.link;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    navigate(item.link);
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 
                  ${isActive
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md border-l-4 border-blue-400"
                                        : "hover:bg-slate-800 text-slate-300"
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Admin</p>
                            <p className="text-xs text-slate-400">Staff User</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-3 flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default StaffSidebar;
