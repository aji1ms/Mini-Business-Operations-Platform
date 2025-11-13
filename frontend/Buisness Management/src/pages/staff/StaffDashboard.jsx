import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffDashboardData } from "../../Redux/slices/staff/dashboardSlice";
import StaffSidebar from "../../components/StaffSidebar";
import Header from "../../components/Header";
import { ClipboardList, CheckCircle, Loader, Briefcase, Clock, Activity } from "lucide-react";
import StatCard from "../../components/StatCard";

const COLORS = ["#fbbf24", "#3b82f6", "#10b981"];

const StaffDashboard = () => {
    const dispatch = useDispatch();
    const { stats, recentTasks, recentActivities, loading } =
        useSelector((state) => state.staffDashboard);

    useEffect(() => {
        dispatch(fetchStaffDashboardData());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <StaffSidebar />

            <main className="flex-1 overflow-auto mx-6 space-y-6 pb-6">
                <Header title="Dashboard" description="Your work summary and progress" />

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title={"My Projects"}
                        value={stats?.myProjects}
                        icon={<Briefcase className="w-6 h-6 text-blue-600" />}
                    />
                    <StatCard
                        title={"My Tasks"}
                        value={stats.myTasks}
                        icon={<ClipboardList className="w-6 h-6 text-red-600" />}
                    />
                    <StatCard
                        title={"Pending Tasks"}
                        value={stats.pendingTasks}
                        icon={<Clock className="w-6 h-6 text-yellow-600" />}
                    />
                    <StatCard
                        title={"Completed"}
                        value={stats.completedTasks}
                        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                    />
                </div>

                {/* Recent Tasks */}
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
                    {recentTasks?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-2 border">Title</th>
                                        <th className="px-4 py-2 border">Project</th>
                                        <th className="px-4 py-2 border">Due Date</th>
                                        <th className="px-4 py-2 border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTasks.map((task) => (
                                        <tr
                                            key={task._id}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="px-4 py-2 border">{task.title}</td>
                                            <td className="px-4 py-2 border">
                                                {task.projectId?.title || "—"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === "Completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : task.status === "In Progress"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">No recent tasks found.</p>
                    )}
                </div>

                {/* Recent Activities */}
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-blue-600" />
                        Recent Activities
                    </h3>
                    <ul className="divide-y divide-gray-200">
                        {recentActivities?.length > 0 ? (
                            recentActivities.map((a) => (
                                <li key={a._id} className="py-3">
                                    <p className="text-sm text-gray-800">{a.action}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(a.createdAt).toLocaleString()}
                                    </p>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-6">
                                No recent activity found.
                            </p>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default StaffDashboard;
