import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../../Redux/slices/admin/adminDashboard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Briefcase, ClipboardList, Activity } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, projectOverview, recentActivities, loading } = useSelector((state) => state.adminDashboard);

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto mx-6 space-y-6">
                <Header title="Dashboard" description="Overview of system activities and stats" />

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <StatCard
                        title={"Total Clients"}
                        value={stats.totalClients}
                        icon={<Users className="w-6 h-6 text-blue-600" />}
                    />
                    <StatCard
                        title={"Total Projects"}
                        value={stats.totalProjects}
                        icon={<Briefcase className="w-6 h-6 text-yellow-600" />}
                    />
                    <StatCard
                        title={"Total Tasks"}
                        value={stats.totalTasks}
                        icon={<ClipboardList className="w-6 h-6 text-orange-600" />}
                    />
                </div>

                {/* Project Overview */}
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="text-lg font-semibold mb-4">Project Overview</h3>
                    {projectOverview?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={projectOverview}>
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500 text-center py-10">No projects found.</p>
                    )}
                </div>

                {/* Recent Activities */}
                <div className="bg-white p-6 rounded-xl shadow border">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-blue-600" />
                        Recent Activities
                    </h3>

                    <ul className="divide-y divide-gray-200">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((a) => (
                                <li key={a._id} className="py-3">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-medium text-blue-600">{a.performedBy?.name}</span> {a.action}
                                    </p>
                                    <p className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</p>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-6">No recent activities found.</p>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
