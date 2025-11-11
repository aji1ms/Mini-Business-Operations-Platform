import { useState, useEffect } from "react";
import { X, FolderKanban, Building, Calendar, Users, Plus, Trash2, CheckSquare } from "lucide-react";

const ProjectModal = ({ isOpen, onClose, onSubmit, clients, mode = "add", projectData = {} }) => {
    const [formData, setFormData] = useState({
        title: "",
        clientId: "",
        description: "",
        startDate: "",
        endDate: "",
        assignedDevelopers: [],
        status: "Planning",
    });

    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "", status: "Pending" });
    const [errors, setErrors] = useState({});
    const [showTaskForm, setShowTaskForm] = useState(false);

    const developers = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Sarah Smith" },
        { id: 3, name: "Mike Johnson" },
        { id: 4, name: "Emma Wilson" },
        { id: 5, name: "Anna Davis" },
    ];

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    // ✅ Pre-fill form if editing or viewing
    useEffect(() => {
        if ((isEdit || isView) && projectData) {
            setFormData({
                title: projectData.title || "",
                clientId: clients.find(c => c.name === projectData.client)?.id || "",
                description: projectData.description || "",
                startDate: projectData.startDate || "",
                endDate: projectData.endDate || "",
                assignedDevelopers:
                    projectData.assignees
                        ?.map(name => developers.find(d => d.name === name)?.id)
                        .filter(Boolean) || [],
                status: projectData.status || "Planning",
            });
            setTasks(projectData.tasks || []);
        }
    }, [isEdit, isView, projectData, clients]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleDeveloperToggle = (id) => {
        setFormData(prev => ({
            ...prev,
            assignedDevelopers: prev.assignedDevelopers.includes(id)
                ? prev.assignedDevelopers.filter(d => d !== id)
                : [...prev.assignedDevelopers, id],
        }));
    };

    const handleAddTask = () => {
        if (!newTask.title.trim()) return alert("Task title required");
        setTasks(prev => [...prev, { id: Date.now(), ...newTask }]);
        setNewTask({ title: "", description: "", assignee: "", status: "Pending" });
        setShowTaskForm(false);
    };

    const handleRemoveTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Project name is required";
        if (!formData.clientId) newErrors.clientId = "Please select a client";
        if (!formData.startDate) newErrors.startDate = "Start date required";
        if (!formData.endDate) newErrors.endDate = "End date required";
        if (formData.startDate > formData.endDate) newErrors.endDate = "End date must be after start date";
        if (!formData.description.trim()) newErrors.description = "Description required";
        if (formData.assignedDevelopers.length === 0) newErrors.assignedDevelopers = "Assign at least one developer";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const selectedClient = clients.find(c => c.id === parseInt(formData.clientId));
        const projectPayload = {
            ...formData,
            id: projectData?.id || Date.now(),
            client: selectedClient?.name || "",
            tasks,
            progress: projectData.progress || 0,
            assignees: formData.assignedDevelopers.map(id => developers.find(d => d.id === id)?.name),
        };

        onSubmit(projectPayload);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-2xl">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isAdd && "Create New Project"}
                            {isEdit && "Edit Project"}
                            {isView && "Project Details"}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Project Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FolderKanban size={20} className="text-blue-600" /> Project Info
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className={`w-full px-4 py-3 border rounded-lg outline-none ${isView ? "bg-gray-100 cursor-not-allowed" : ""
                                        } ${errors.title ? "border-red-500" : "border-gray-300"}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                                <select
                                    name="clientId"
                                    value={formData.clientId}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className={`w-full px-4 py-3 border rounded-lg ${isView ? "bg-gray-100 cursor-not-allowed" : ""
                                        } ${errors.clientId ? "border-red-500" : "border-gray-300"}`}
                                >
                                    <option value="">Select a client</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                >
                                    <option>Planning</option>
                                    <option>In Progress</option>
                                    <option>On Hold</option>
                                    <option>Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Developers Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users size={20} className="text-blue-600" /> Assigned Developers
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {developers.map(dev => (
                                <button
                                    key={dev.id}
                                    type="button"
                                    disabled={isView}
                                    onClick={() => handleDeveloperToggle(dev.id)}
                                    className={`p-3 rounded-lg border-2 transition ${formData.assignedDevelopers.includes(dev.id)
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-300"
                                        } ${isView ? "cursor-not-allowed opacity-70" : ""}`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold">
                                            {dev.name.charAt(0)}
                                        </div>
                                        <span className="text-sm">{dev.name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            {isView ? "Close" : "Cancel"}
                        </button>
                        {!isView && (
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {isEdit ? "Save Changes" : "Create Project"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
