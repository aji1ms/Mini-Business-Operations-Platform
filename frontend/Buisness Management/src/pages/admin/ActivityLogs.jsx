import { Activity } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const ActivityLogs = () => {

    const activities = [
        { id: 1, action: 'Client Added', entity: 'Acme Corp', user: 'Admin', timestamp: '2 hours ago', type: 'create' },
        { id: 2, action: 'Project Updated', entity: 'E-commerce Platform', user: 'John Doe', timestamp: '4 hours ago', type: 'update' },
        { id: 3, action: 'Task Completed', entity: 'Login Module', user: 'Sarah Smith', timestamp: '6 hours ago', type: 'complete' },
        { id: 4, action: 'Client Status Changed', entity: 'Global Enterprises', user: 'Admin', timestamp: '1 day ago', type: 'update' },
    ];

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto mx-4">
                <Header title={"Activity Logs"} description={"System activity and audit logs"} />

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="divide-y divide-gray-200">
                        {activities.map(activity => (
                            <div key={activity.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'create' ? 'bg-green-100 text-green-600' :
                                        activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                        <Activity size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{activity.action}</p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    <span className="font-medium">{activity.entity}</span> by {activity.user}
                                                </p>
                                            </div>
                                            <span className="text-sm text-gray-500">{activity.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityLogs;