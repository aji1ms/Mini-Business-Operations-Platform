import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    Activity,
    Search,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from "../components/StatCard"
import { navItems } from '../utils/constants';
import Header from '../components/Header';


// Main App Component
const Dashboard = () => {

    const projects = [
        { id: 1, title: 'E-commerce Platform', client: 'Acme Corp', status: 'In Progress', progress: 65, deadline: '2024-12-15', assignees: ['John', 'Sarah'], tasks: 24 },
        { id: 2, title: 'Mobile App Development', client: 'Tech Solutions Inc', status: 'In Progress', progress: 40, deadline: '2024-11-30', assignees: ['Mike', 'Emma'], tasks: 18 },
        { id: 3, title: 'Dashboard Redesign', client: 'Global Enterprises', status: 'On Hold', progress: 20, deadline: '2024-12-20', assignees: ['Anna'], tasks: 12 },
    ];

    const activities = [
        { id: 1, action: 'Client Added', entity: 'Acme Corp', user: 'Admin', timestamp: '2 hours ago', type: 'create' },
        { id: 2, action: 'Project Updated', entity: 'E-commerce Platform', user: 'John Doe', timestamp: '4 hours ago', type: 'update' },
        { id: 3, action: 'Task Completed', entity: 'Login Module', user: 'Sarah Smith', timestamp: '6 hours ago', type: 'complete' },
        { id: 4, action: 'Client Status Changed', entity: 'Global Enterprises', user: 'Admin', timestamp: '1 day ago', type: 'update' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-auto mx-4">
                <Header title={"Dashboard"} description={"Welcome back! Here's your business overview"} />

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Active Clients"
                            value="10"
                            icon={<Users className="w-6 h-6 text-blue-600" />}
                        />
                        <StatCard
                            title="Projects in Progress"
                            value="4"
                            icon={<FolderKanban className="w-6 h-6 text-green-600" />}
                        />
                        <StatCard
                            title="Total Tasks"
                            value="50"
                            icon={<CheckCircle className="w-6 h-6 text-purple-600" />}
                        />
                        <StatCard
                            title="Overdue Items"
                            value="3"
                            icon={<AlertCircle className="w-6 h-6 text-red-600" />}
                        />
                    </div>

                    {/* Projects Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">Projects Overview</h3>
                            <div className="space-y-4">
                                {projects.map(project => (
                                    <div key={project.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">{project.title}</span>
                                            <span className="text-sm text-gray-500">{project.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${project.progress > 60 ? 'bg-green-500' :
                                                    project.progress > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {activities.slice(0, 5).map(activity => (
                                    <div key={activity.id} className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'create' ? 'bg-green-100 text-green-600' :
                                            activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                                                'bg-purple-100 text-purple-600'
                                            }`}>
                                            <Activity size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                            <p className="text-xs text-gray-500">{activity.entity} • {activity.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
export default Dashboard;