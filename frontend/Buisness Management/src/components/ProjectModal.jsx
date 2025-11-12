import { useState, useEffect } from "react";
import { X, FolderKanban, Building, Calendar, Users } from "lucide-react";
import { useDispatch } from "react-redux";
import { addProject, updateProject, fetchProjects } from "../Redux/slices/admin/adminProjectSlice";
import toast from "react-hot-toast";

const ProjectModal = ({
    isOpen,
    onClose,
    clients,
    developers,
    mode = "add",
    projectData = {},
}) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: "",
        clientId: "",
        description: "",
        startDate: "",
        endDate: "",
        assignedDevelopers: [],
        status: "New",
    });

    const [errors, setErrors] = useState({});
    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    useEffect(() => {
        if ((isEdit || isView) && projectData) {
            setFormData({
                title: projectData.title || "",
                clientId: projectData.clientId?._id || "",
                description: projectData.description || "",
                startDate: projectData.timeline?.startDate?.slice(0, 10) || "",
                endDate: projectData.timeline?.endDate?.slice(0, 10) || "",
                assignedDevelopers: projectData.assignedDevelopers?.map((dev) => dev._id) || [],
                status: projectData.status || "New",
            });
        } else if (isAdd) {
            setFormData({
                title: "",
                clientId: "",
                description: "",
                startDate: "",
                endDate: "",
                assignedDevelopers: [],
                status: "New",
            });
        }
    }, [isEdit, isView, projectData, isAdd]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleDeveloperToggle = (id) => {
        if (isView) return;
        setFormData((prev) => ({
            ...prev,
            assignedDevelopers: prev.assignedDevelopers.includes(id)
                ? prev.assignedDevelopers.filter((d) => d !== id)
                : [...prev.assignedDevelopers, id],
        }));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Project title is required";
        if (!formData.clientId) newErrors.clientId = "Please select a client";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        if (!formData.startDate) newErrors.startDate = "Start date required";
        if (!formData.endDate) newErrors.endDate = "End date required";
        if (formData.startDate && formData.endDate && formData.startDate > formData.endDate)
            newErrors.endDate = "End date must be after start date";
        if (formData.assignedDevelopers.length === 0)
            newErrors.assignedDevelopers = "Assign at least one developer";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const projectPayload = {
            clientId: formData.clientId,
            title: formData.title,
            description: formData.description,
            timeline: { startDate: formData.startDate, endDate: formData.endDate },
            assignedDevelopers: formData.assignedDevelopers,
            status: formData.status,
        };

        if (isEdit) {
            await dispatch(updateProject({ id: projectData._id, projectData: projectPayload }));
            toast.success("project updated!", { duration: 2000 })
        } else {
            await dispatch(addProject(projectPayload));
            toast.success("project created!", { duration: 2000 })
        }

        dispatch(fetchProjects());
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
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isAdd && "Create New Project"}
                        {isEdit && "Edit Project"}
                        {isView && "Project Details"}
                    </h2>
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
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className={`w-full px-4 py-3 border rounded-lg outline-none ${isView ? "bg-gray-100 cursor-not-allowed" : ""
                                        } ${errors.title ? "border-red-500" : "border-gray-300"}`}
                                />
                                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                            </div>

                            {/* Client */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Client <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="clientId"
                                    value={formData.clientId}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className={`w-full px-4 py-3 border rounded-lg ${errors.clientId ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Select a client</option>
                                    {clients.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.clientId && <p className="text-sm text-red-500 mt-1">{errors.clientId}</p>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    disabled={isView}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                                >
                                    <option>New</option>
                                    <option>In Progress</option>
                                    <option>On Hold</option>
                                    <option>Completed</option>
                                    <option>Closed</option>
                                </select>
                            </div>

                            {/* Dates */}
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
                                {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
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
                                {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isView}
                                    rows={3}
                                    className={`w-full px-4 py-3 border rounded-lg resize-none ${errors.description ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Developers */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users size={20} className="text-blue-600" /> Assigned Developers
                        </h3>
                        {errors.assignedDevelopers && (
                            <p className="text-sm text-red-500 mb-2">{errors.assignedDevelopers}</p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {developers.map((dev) => (
                                <button
                                    key={dev._id}
                                    type="button"
                                    disabled={isView}
                                    onClick={() => handleDeveloperToggle(dev._id)}
                                    className={`p-3 rounded-lg border-2 transition ${formData.assignedDevelopers.includes(dev._id)
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
