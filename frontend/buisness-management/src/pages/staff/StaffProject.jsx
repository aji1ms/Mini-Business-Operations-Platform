import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProjects, updateProjectStatus, setFilters, setPagination } from "../../Redux/slices/staff/projectSlice";
import Header from "../../components/Header";
import StaffSidebar from "../../components/StaffSidebar";
import { Search, Filter, Eye, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import StaffProjectModal from "../../components/tStaffProjectModal";

const StaffProject = () => {
    const dispatch = useDispatch();
    const { projects, pagination, filters, loading, summary } = useSelector((s) => s.staffProjects);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(t);
    }, [searchQuery]);

    useEffect(() => {
        const params = {
            ...filters,
            search: debouncedSearch || filters.search,
            page: pagination.page,
            limit: pagination.limit,
        };
        dispatch(fetchMyProjects(params));
    }, [dispatch, filters, debouncedSearch, pagination.page, pagination.limit]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        dispatch(setFilters({ search: value }));
        if (pagination.page !== 1) dispatch(setPagination({ page: 1 }));
    };

    const handleStatusFilter = (e) => {
        const val = e.target.value === "All" ? "" : e.target.value;
        dispatch(setFilters({ status: val }));
        if (pagination.page !== 1) dispatch(setPagination({ page: 1 }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            dispatch(setPagination({ page: newPage }));
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await dispatch(updateProjectStatus({ id, status: newStatus })).unwrap();
            toast.success("Status updated successfully");
            dispatch(fetchMyProjects({ ...filters, page: pagination.page, limit: pagination.limit }));
            setShowModal(false);
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to update status");
        }
    };

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
        <div className="flex h-screen bg-gray-50">
            <StaffSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                            <Header
                                title="Projects"
                                description="Manage your assigned projects"
                            />

                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Filter size={18} className="text-gray-500" />
                                    <select
                                        value={filters.status || "All"}
                                        onChange={handleStatusFilter}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="New">New</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Paused">Paused</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Projects Table */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Team
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    Loading projects...
                                                </td>
                                            </tr>
                                        ) : projects.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    No projects found
                                                </td>
                                            </tr>
                                        ) : (
                                            projects.map((project) => (
                                                <tr key={project._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {project.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {project.description || "No description"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {project.clientId?.name || "—"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {project.clientId?.company || "—"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {project.assignedDevelopers?.map((dev) => (
                                                                <span
                                                                    key={dev._id}
                                                                    className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                                                                >
                                                                    {dev.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                                            {project.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setModalMode("view");
                                                                    setSelectedProject(project);
                                                                    setShowModal(true);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setModalMode("edit");
                                                                    setSelectedProject(project);
                                                                    setShowModal(true);
                                                                }}
                                                                className="text-gray-600 hover:text-gray-900 p-1 rounded"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 px-2">
                                <div className="text-sm text-gray-700">
                                    Showing page {pagination.page} of {pagination.totalPages} •{" "}
                                    {summary?.totalFiltered || 0} projects
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    <span className="text-sm text-gray-700">
                                        Page {pagination.page} of {pagination.totalPages}
                                    </span>

                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <StaffProjectModal
                    mode={modalMode}
                    project={selectedProject}
                    onClose={() => setShowModal(false)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
};

export default StaffProject;