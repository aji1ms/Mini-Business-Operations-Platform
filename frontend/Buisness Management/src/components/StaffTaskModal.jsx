import { X, Calendar, ClipboardList, CheckCircle2, User, Flag } from "lucide-react";
import { useState } from "react";

const StaffTaskModal = ({ mode, task, onClose, onUpdateStatus }) => {
    const [status, setStatus] = useState(task?.status || "");
    const isView = mode === "view";
    const isEdit = mode === "edit";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit && task?._id && status) {
            onUpdateStatus(task._id, status);
        } else {
            onClose();
        }
    };

    if (!task) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "In Progress": return "bg-blue-100 text-blue-800";
            case "Completed": return "bg-green-100 text-green-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isView ? "Task Details" : "Update Status"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ClipboardList className="text-blue-600" size={18} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Task Title
                            </label>
                            <p className="text-gray-900">{task.title}</p>
                        </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <ClipboardList className="text-gray-600" size={18} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <p className="text-gray-900 text-sm">{task.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Project */}
                    {task.projectId && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <ClipboardList className="text-purple-600" size={18} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Project
                                </label>
                                <p className="text-gray-900 text-sm">{task.projectId.title || "—"}</p>
                            </div>
                        </div>
                    )}

                    {/* Due Date */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Calendar className="text-orange-600" size={18} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Due Date
                            </label>
                            <p className="text-gray-900 text-sm">
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
                            </p>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <CheckCircle2 className="text-indigo-600" size={18} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            {isView ? (
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            ) : (
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isView ? "Close" : "Cancel"}
                    </button>
                    {isEdit && (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Update Status
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffTaskModal;