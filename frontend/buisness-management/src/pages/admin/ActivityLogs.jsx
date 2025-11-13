import { Activity, Loader2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchActivityLogs } from "../../Redux/slices/admin/adminActivitySlice";

const ActivityLogs = () => {
    const dispatch = useDispatch();
    const { logs, loading, error } = useSelector((state) => state.activities);

    useEffect(() => {
        dispatch(fetchActivityLogs())
    }, [dispatch])

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatActionText = (action) => {
        return action
            .split('_')
            .map(word => word.charAt(0) + word.slice(1).toLowerCase())
            .join(' ');
    };

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 overflow-auto mx-4">
                    <Header title={"Activity Logs"} description={"System activity and audit logs"} />

                    {/* Loading Spinner */}
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">Loading activity logs...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto mx-4">
                <Header title={"Activity Logs"} description={"System activity and audit logs"} />

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {logs.length === 0 ? (
                        // Empty State
                        <div className="text-center py-12">
                            <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity logs found</h3>
                            <p className="text-gray-600">Activities will appear here as they occur</p>
                        </div>
                    ) : (
                        // Activity Logs List
                        <div className="divide-y divide-gray-200">
                            {logs.map(log => (
                                <div key={log?.id || log?._id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="flex items-start gap-4">
                                        <div className='w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600'>
                                            <Activity size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {formatActionText(log?.action)}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        <span className="font-medium">{log?.entityName}</span>
                                                        {log?.details && ` - ${log.details}`} by {" "}
                                                        <span className={`font-medium ${log?.performedBy?.role === 'admin'
                                                                ? 'text-red-600'
                                                                : 'text-blue-600'
                                                            }`}>
                                                            {log?.performedBy?.name}
                                                            {log?.performedBy?.role === 'admin' && ' (Admin)'}
                                                        </span>
                                                    </p>
                                                </div>
                                                <span className="text-sm text-gray-500 whitespace-nowrap">
                                                    {formatDate(log?.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ActivityLogs;