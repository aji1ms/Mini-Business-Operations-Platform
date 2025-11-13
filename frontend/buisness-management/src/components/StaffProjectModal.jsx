import { X, Users, Calendar, CheckCircle2, Building, FileText } from "lucide-react";

const StaffProjectModal = ({ mode, project, onClose, onUpdateStatus }) => {
    const [status, setStatus] = useState(project?.status || "");

    const isView = mode === "view";
    const isEdit = mode === "edit";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit && project?._id && status) {
            onUpdateStatus(project._id, status);
        } else {
            onClose();
        }
    };

    if (!project) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "New": return "bg-blue-100 text-blue-800";
            case "In Progress": return "bg-green-100 text-green-800";
            case "Completed": return "bg-purple-100 text-purple-800";
            case "Paused": return "bg-yellow-100 text-yellow-800";
            case "Closed": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isView ? "Project Details" : "Update Status"}
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
                    {/* Project Title */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="text-blue-600" size={18} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Title
                            </label>
                            <p className="text-gray-900">{project.title}</p>
                        </div>
                    </div>

                    {/* Client */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Building className="text-green-600" size={18} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Client
                            </label>
                            <p className="text-gray-900">{project.clientId?.name || "—"}</p>
                            {project.clientId?.company && (
                                <p className="text-sm text-gray-500">{project.clientId.company}</p>
                            )}
                        </div>
                    </div>

                    {/* Team */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Users className="text-purple-600" size={18} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Team Members
                            </label>
                            <div className="flex flex-wrap gap-1">
                                {project.assignedDevelopers?.map((dev) => (
                                    <span
                                        key={dev._id}
                                        className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-700"
                                    >
                                        {dev.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Calendar className="text-orange-600" size={18} />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Timeline
                            </label>
                            <p className="text-gray-900 text-sm">
                                {project.timeline?.startDate
                                    ? new Date(project.timeline.startDate).toLocaleDateString()
                                    : "Not set"
                                } - {" "}
                                {project.timeline?.endDate
                                    ? new Date(project.timeline.endDate).toLocaleDateString()
                                    : "Not set"
                                }
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
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </span>
                            ) : (
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="New">New</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Paused">Paused</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <FileText className="text-gray-600" size={18} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <p className="text-gray-900 text-sm">{project.description}</p>
                            </div>
                        </div>
                    )}
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

export default StaffProjectModal;