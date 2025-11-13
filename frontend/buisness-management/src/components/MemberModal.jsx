import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, } from 'lucide-react';

const MemberModal = ({ isOpen, onClose, onSubmit, mode = "add", memberData = null, loading = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Staff',
        status: 'Active',
    });

    
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    
    useEffect(() => {
        if (memberData && (mode === 'edit' || mode === 'view')) {
            setFormData({
                ...memberData,
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'Staff',
                status: 'Active',
            });
        }
    }, [memberData, mode, isOpen]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (mode === 'add') {
            if (!formData.password) {
                newErrors.password = 'Password is required';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
                newErrors.password = 'Password must contain uppercase, lowercase, and number';
            }
            
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
               
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (mode === 'view') {
            onClose();
            return;
        }
        
        if (validateForm()) {
            const submitData = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                role: formData.role.toLowerCase(),
                isActive: formData.status === 'Active'
            };
            
            if (formData.password) {
                submitData.password = formData.password;
            }

            if (mode === 'edit' && memberData) {
                submitData.id = memberData.id;
            }
            
            onSubmit(submitData);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'Staff',
            status: 'Active',
        });
        setErrors({});
        setShowPassword(false);
        onClose();
    };

    if (!isOpen) return null;

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-opacity-50 transition-opacity bg-black/50 backdrop-blur-2xl"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isViewMode ? 'Member Details' : isEditMode ? 'Edit Member' : 'Add New Member'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {isViewMode ? 'View member information' : isEditMode ? 'Update member information' : 'Fill in the member details below'}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        placeholder="Enter full name"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            } ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <span>⚠</span> {errors.name}
                                    </p>
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
                                        placeholder="member@company.com"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            } ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                        <span>⚠</span> {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password*/}
                            {isAddMode && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Password {isAddMode && <span className="text-red-500">*</span>}
                                            {isEditMode && <span className="text-xs text-gray-500 ml-1">(Leave empty to keep current)</span>}
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter password"
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <span>⚠</span> {errors.password}
                                            </p>
                                        )}
                                        {!errors.password && formData.password && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                Must contain uppercase, lowercase, and number
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm Password {isAddMode && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm password"
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <span>⚠</span> {errors.confirmPassword}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        disabled={isViewMode}
                                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition appearance-none ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                                            }`}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Staff">Staff</option>
                                    </select>
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
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                                        }`}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Show Password Toggle */}
                        {isAddMode && (
                            <div className="mt-6">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={(e) => setShowPassword(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700">Show passwords</span>
                                </label>
                            </div>
                        )}

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                {isViewMode ? 'Close' : 'Cancel'}
                            </button>
                            {!isViewMode && (
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-medium shadow-lg shadow-blue-500/30"
                                >
                                    {isEditMode ? 'Update Member' : 'Add Member'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MemberModal;