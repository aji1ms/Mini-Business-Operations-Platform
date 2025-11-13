import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Building2, MapPin } from "lucide-react";

const ClientModal = ({ isOpen, onClose, onSubmit, mode = "add", clientData = null, loading = false }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        status: "New",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if ((mode === "edit" || mode === "view") && clientData) {
            setFormData({
                name: clientData.name || "",
                email: clientData.email || "",
                phone: clientData.phone || "",
                company: clientData.company || "",
                address: clientData.address || "",
                status: clientData.status || "New",
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                company: "",
                address: "",
                status: "New",
            });
        }
        setErrors({});
    }, [mode, clientData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Client name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = "Invalid phone number";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === "view") return onClose();

        if (validateForm()) {
            const payload = { ...formData };
            if (mode === "edit" && clientData?._id) payload._id = clientData._id;
            onSubmit(payload);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            address: "",
            status: "New",
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isAddMode && "Add New Client"}
                            {isEditMode && "Edit Client"}
                            {isViewMode && "Client Details"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isAddMode && "Fill out details to add a new client."}
                            {isEditMode && "Update the client’s details below."}
                            {isViewMode && "View client information."}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={22} className="text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Client Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isViewMode}
                                placeholder="Enter client name"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.name ? "border-red-500" : "border-gray-300"} ${isViewMode ? "bg-gray-50 cursor-not-allowed" : ""
                                    }`}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isViewMode}
                                placeholder="client@example.com"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.email ? "border-red-500" : "border-gray-300"} ${isViewMode ? "bg-gray-50 cursor-not-allowed" : ""
                                    }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isViewMode}
                                placeholder="+91 98765 43210"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${errors.phone ? "border-red-500" : "border-gray-300"} ${isViewMode ? "bg-gray-50 cursor-not-allowed" : ""
                                    }`}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                        )}
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                        </label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                disabled={isViewMode}
                                placeholder="Enter company name"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isViewMode ? "bg-gray-50 cursor-not-allowed" : ""}`}
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                disabled={isViewMode}
                                placeholder="Enter address"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isViewMode ? "bg-gray-50 cursor-not-allowed" : ""}`}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={isViewMode}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${isViewMode ? "bg-gray-50 cursor-not-allowed" : ""}`}
                        >
                            <option value="New">New</option>
                            <option value="Active">Active</option>
                            <option value="Paused">Paused</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            {isViewMode ? "Close" : "Cancel"}
                        </button>
                        {!isViewMode && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                {isEditMode ? "Save Changes" : "Add Client"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientModal;
