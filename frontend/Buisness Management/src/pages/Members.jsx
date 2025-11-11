import { Building2, Edit, Eye, Filter, Shield, Mail, Phone, Plus, Search, Trash2, User, ShieldCheck } from "lucide-react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import MemberModal from "../components/MemberModal";

const Members = () => {
    const members = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@company.com',
            phone: '+1 234 567 8900',
            role: 'Admin',
            status: 'Active',
            department: 'Engineering',
            joinedAt: '2024-01-15',
            projectsAssigned: 5
        },
        {
            id: 2,
            name: 'Sarah Smith',
            email: 'sarah.smith@company.com',
            phone: '+1 234 567 8901',
            role: 'Staff',
            status: 'Active',
            department: 'Design',
            joinedAt: '2024-02-20',
            projectsAssigned: 3
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.johnson@company.com',
            phone: '+1 234 567 8902',
            role: 'Staff',
            status: 'Active',
            department: 'Engineering',
            joinedAt: '2024-03-10',
            projectsAssigned: 4
        },
        {
            id: 4,
            name: 'Emma Wilson',
            email: 'emma.wilson@company.com',
            phone: '+1 234 567 8903',
            role: 'Staff',
            status: 'Inactive',
            department: 'Marketing',
            joinedAt: '2024-01-05',
            projectsAssigned: 0
        },
    ];

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedMember, setSelectedMember] = useState(null);
    const [filterRole, setFilterRole] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = members.filter(member => {
        const matchesRole = filterRole === 'All' || member.role === filterRole;
        const matchesStatus = filterStatus === 'All' || member.status === filterStatus;
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesStatus && matchesSearch;
    });

    const handleAddMember = (newMember) => {
        setMembers((prev) => [...prev, { ...newMember, id: Date.now() }]);
    };

    const handleUpdateMember = (updatedMember) => {
        setMembers((prev) =>
            prev.map((member) => (member.id === updatedMember.id ? updatedMember : member))
        );
    };

    const stats = {
        total: members.length,
        active: members.filter(m => m.status === 'Active').length,
        admins: members.filter(m => m.role === 'Admin').length,
        staff: members.filter(m => m.role === 'Staff').length,
    };

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
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Members"
                        value="10"
                        icon={<User className="w-6 h-6 text-blue-600" />}
                    />
                    <StatCard
                        title="Active Members"
                        value="4"
                        icon={<Shield className="w-6 h-6 text-green-600" />}
                    />
                    <StatCard
                        title="Administrators"
                        value="6"
                        icon={<ShieldCheck className="w-6 h-6 text-purple-600" />}
                    />
                    <StatCard
                        title="Staff Members"
                        value="13"
                        icon={<User className="w-6 h-6 text-red-600" />}
                    />
                </div>

                {/* Actions Bar */}
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
                            <option>All Roles</option>
                            <option>Admin</option>
                            <option>Staff</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
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

                {/* Members Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {filteredMembers.map(member => (
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
                                    <Phone size={14} />
                                    <span>{member.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Building2 size={14} />
                                    <span>{member.department}</span>
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
                                        className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredMembers.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <User size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
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
                />
            </div>
        </div>
    );
};

export default Members;