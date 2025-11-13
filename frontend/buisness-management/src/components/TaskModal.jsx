import { useState, useEffect } from "react";
import { X, Calendar, User, CheckCircle2, Building2 } from "lucide-react";

const TaskModal = ({ isOpen, onClose, mode = "add", taskData = null, projects = [], onSubmit }) => {
    const [formData, setFormData] = useState({
        projectId: "",
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "Pending",
    });

    const [availableDevelopers, setAvailableDevelopers] = useState([]);
    const [errors, setErrors] = useState({});

    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    useEffect(() => {
        if ((isEdit || isView) && taskData) {
            const projectId = taskData.projectId?._id || taskData.projectId || "";
            setFormData({
                projectId,
                title: taskData.title || "",
                description: taskData.description || "",
                assignedTo: taskData.assignedTo?._id || taskData.assignedTo || "",
                dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
                status: taskData.status || "Pending",
            });

            const selected = projects.find((p) => (p._id || p.id) === (projectId));
            setAvailableDevelopers(selected?.assignedDevelopers || []);
        } else {
            setFormData({
                projectId: "",
                title: "",
                description: "",
                assignedTo: "",
                dueDate: "",
                status: "Pending",
            });
            setAvailableDevelopers([]);
            setErrors({});
        }
    }, [taskData, mode, projects]);

    useEffect(() => {
        if (formData.projectId) {
            const selected = projects.find((p) => (p._id || p.id) === formData.projectId);
            setAvailableDevelopers(selected?.assignedDevelopers || []);
        } else {
            setAvailableDevelopers([]);
        }
    }, [formData.projectId, projects]);

    const handleProjectChange = (e) => {
        const projectId = e.target.value;
        setFormData((prev) => ({ ...prev, projectId, assignedTo: "" }));
        if (errors.projectId) setErrors((s) => ({ ...s, projectId: "" }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((s) => ({ ...s, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectId) newErrors.projectId = "Project is required";
        if (!formData.title?.trim()) newErrors.title = "Task title is required";
        if (!formData.description?.trim()) newErrors.description = "Description is required";
        if (!formData.assignedTo) newErrors.assignedTo = "Please assign a developer";
        if (!formData.dueDate) newErrors.dueDate = "Due date is required";
        else {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const due = new Date(formData.dueDate);
            if (due < today) newErrors.dueDate = "Due date cannot be in the past";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();
        if (isView) { onClose(); return; }
        if (!validateForm()) return;

        const payload = {
            projectId: formData.projectId,
            title: formData.title.trim(),
            description: formData.description.trim(),
            assignedTo: formData.assignedTo,
            dueDate: formData.dueDate,
            status: formData.status,
        };

        onSubmit(payload);
        handleClose()
        onClose();
    };

    const handleClose = () => {
        setFormData({
            projectId: "",
            title: "",
            description: "",
            assignedTo: "",
            dueDate: "",
            status: "Pending",
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
                    {isView ? "Task Details" : isEdit ? "Edit Task" : "Add Task"}
                </h2>

                <form onSubmit={submit} className="space-y-4">
                    {/* Project */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Building2 size={16} className="text-blue-600" /> Project
                        </label>
                        <select
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleProjectChange}
                            disabled={isView}
                            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${errors.projectId ? "border-red-500" : "border-gray-300"} ${isView ? "bg-gray-100" : ""}`}
                        >
                            <option value="">Select project</option>
                            {projects.map((p) => (
                                <option key={p._id || p.id} value={p._id || p.id}>
                                    {p.title || p.name}
                                </option>
                            ))}
                        </select>
                        {errors.projectId && <p className="mt-1 text-sm text-red-500">{errors.projectId}</p>}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={isView}
                            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? "border-red-500" : "border-gray-300"} ${isView ? "bg-gray-100" : ""}`}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={isView}
                            rows={3}
                            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? "border-red-500" : "border-gray-300"} ${isView ? "bg-gray-100" : ""}`}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                    </div>

                    {/* Assign */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <User size={16} className="text-blue-600" /> Assign to
                        </label>

                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleChange}
                            disabled={isView || availableDevelopers.length === 0}
                            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${errors.assignedTo ? "border-red-500" : "border-gray-300"} ${isView ? "bg-gray-100" : ""}`}
                        >
                            <option value="">Select developer</option>
                            {availableDevelopers.map((dev) => (
                                <option key={dev._id || dev.id} value={dev._id || dev.id}>
                                    {dev.name} {dev.email ? `(${dev.email})` : ""}
                                </option>
                            ))}
                        </select>
                        {errors.assignedTo && <p className="mt-1 text-sm text-red-500">{errors.assignedTo}</p>}
                        {formData.projectId && availableDevelopers.length === 0 && (
                            <p className="mt-1 text-sm text-yellow-600">No developers assigned to this project</p>
                        )}
                    </div>

                    {/* Due date */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-blue-600" /> Due date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            disabled={isView}
                            min={new Date().toISOString().split("T")[0]}
                            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${errors.dueDate ? "border-red-500" : "border-gray-300"} ${isView ? "bg-gray-100" : ""}`}
                        />
                        {errors.dueDate && <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-blue-600" /> Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={isView}
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button type="button" onClick={onClose} className="px-5 py-2 border rounded-lg hover:bg-gray-50">
                            {isView ? "Close" : "Cancel"}
                        </button>
                        {!isView && (
                            <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                {isEdit ? "Save Changes" : "Create Task"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
