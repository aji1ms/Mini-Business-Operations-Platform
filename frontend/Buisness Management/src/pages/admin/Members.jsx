import { Edit, Eye, Filter, Shield, Mail, Plus, Search, Trash2, User, ShieldCheck, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import StatCard from "../../components/StatCard";
import MemberModal from "../../components/MemberModal";
import { useDispatch, useSelector } from "react-redux";
import { addMember, deleteMember, fetchMembers, setPagination, updateMember } from "../../Redux/slices/admin/adminStaffSlice";
import toast from "react-hot-toast";

const Members = () => {
    const dispatch = useDispatch();
    const { members, summary, pagination, loading, error } = useSelector((state) => state.staffs);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedMember, setSelectedMember] = useState(null);
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const apiFilters = {
            page: pagination.currentPage,
            limit: pagination.limit
        };

        if (filterRole !== 'All') apiFilters.role = filterRole.toLowerCase();
        if (filterStatus !== 'All') {
            apiFilters.status = filterStatus.toLowerCase() === 'active' ? 'active' : 'inactive';
        }
        if (debouncedSearch) apiFilters.search = debouncedSearch;

        dispatch(fetchMembers(apiFilters));
    }, [dispatch, filterRole, filterStatus, debouncedSearch, pagination.currentPage, pagination.limit]);

    useEffect(() => {
        if (pagination.currentPage !== 1) {
            dispatch(setPagination({ currentPage: 1 }));
        }
    }, [filterRole, filterStatus, debouncedSearch]);

    const handleAddMember = async (newMember) => {
        try {
            await dispatch(addMember(newMember)).unwrap();
            toast.success("Member added successfully!");
            setShowModal(false);
        } catch (error) {
            toast.error(error || "Failed to add member")
        }
    };

    const handleUpdateMember = async (updatedMember) => {
        try {
            await dispatch(updateMember({
                id: updatedMember.id,
                memberData: updatedMember
            })).unwrap();
            toast.success("Member updated successfully!");
            setShowModal(false);
        } catch (error) {
            toast.error(error || "Failed to update member");
        }
    };

    const handleDeleteMember = (memberId) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            dispatch(deleteMember(memberId));
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            dispatch(setPagination({ currentPage: newPage }));
        }
    };

    const handleFirstPage = () => {
        handlePageChange(1);
    };

    const handleLastPage = () => {
        handlePageChange(pagination.totalPages);
    };

    const handlePreviousPage = () => {
        handlePageChange(pagination.currentPage - 1);
    };

    const handleNextPage = () => {
        handlePageChange(pagination.currentPage + 1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const formattedMembers = members.map(member => ({
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role.charAt(0).toUpperCase() + member.role.slice(1),
        status: member.isActive ? 'Active' : 'Inactive',
        joinedAt: member.createdAt ? new Date(member.createdAt).toISOString().split('T')[0] : '2024-01-01',
        projectsAssigned: member.projectCount || 0
    }));

    const stats = [
        {
            title: "Total Members",
            value: summary?.totalUsers?.toString() || "0",
            icon: <User className="w-6 h-6 text-blue-600" />,
            color: "blue"
        },
        {
            title: "Active Members",
            value: summary ? (summary.totalUsers - summary.totalInactive).toString() : "0",
            icon: <Shield className="w-6 h-6 text-green-600" />,
            color: "green"
        },
        {
            title: "Administrators",
            value: summary?.totalAdmins?.toString() || "0",
            icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
            color: "purple"
        },
        {
            title: "Staff Members",
            value: summary?.totalStaff?.toString() || "0",
            icon: <User className="w-6 h-6 text-red-600" />,
            color: "red"
        },
    ];

    const generatePageNumbers = () => {
        const pages = [];
        const current = pagination.currentPage;
        const total = pagination.totalPages;

        if (total <= 7) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            if (current <= 4) {
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(total);
            } else if (current >= total - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = total - 4; i <= total; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = current - 1; i <= current + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(total);
            }
        }

        return pages;
    };

    if (loading) {
        return (
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading members...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex-1 overflow-auto mx-4">
                <div className="flex items-center justify-between mt-4 mb-6">
                    <Header
                        title={"Team Members"}
                        description={"Manage your team members and their roles"}
                    />

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                        />
                        {searchQuery !== debouncedSearch && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between mb-6 pt-5">
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            <Filter size={18} />
                            <span className="text-sm">Filter</span>
                        </button>

                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="All">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            setModalMode("add");
                            setSelectedMember(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Add Member</span>
                    </button>
                </div>

                {searchQuery !== debouncedSearch && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <p className="text-blue-700 text-sm">Searching for "{searchQuery}"...</p>
                    </div>
                )}

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {formattedMembers.map(member => (
                        <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${member.role === 'Admin' ? 'bg-red-500' : 'bg-blue-700'
                                        }`}>
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.role === 'Admin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {member.role}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.status === 'Active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {member.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail size={14} />
                                    <span className="truncate">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Shield size={14} />
                                    <span>{member.projectsAssigned} Projects Assigned</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-3">
                                    Joined {new Date(member.joinedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setModalMode("view");
                                            setSelectedMember(member);
                                            setShowModal(true);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                    >
                                        <Eye size={16} />
                                        View
                                    </button>
                                    <button
                                        onClick={() => {
                                            setModalMode("edit");
                                            setSelectedMember(member);
                                            setShowModal(true);
                                        }}
                                        className="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMember(member.id)}
                                        className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleFirstPage}
                                disabled={pagination.currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronsLeft size={16} />
                            </button>

                            <button
                                onClick={handlePreviousPage}
                                disabled={pagination.currentPage === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {generatePageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                                    className={`min-w-10 px-3 py-2 rounded-lg border text-sm font-medium transition ${page === pagination.currentPage
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : page === '...'
                                            ? 'border-transparent text-gray-500 cursor-default'
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    disabled={page === '...'}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={handleNextPage}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={16} />
                            </button>

                            <button
                                onClick={handleLastPage}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <ChevronsRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {formattedMembers.length === 0 && !loading && searchQuery === debouncedSearch && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <User size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {debouncedSearch ? `No members found for "${debouncedSearch}"` : 'No members found'}
                        </h3>
                        <p className="text-gray-500 mb-4">Try adjusting your filters or add a new member</p>
                        <button
                            onClick={() => {
                                setModalMode("add");
                                setSelectedMember(null);
                                setShowModal(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={18} />
                            Add Your First Member
                        </button>
                    </div>
                )}

                {/* Member Modal */}
                <MemberModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={modalMode === "add" ? handleAddMember : handleUpdateMember}
                    mode={modalMode}
                    memberData={selectedMember}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Members;