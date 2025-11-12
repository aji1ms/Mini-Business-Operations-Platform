import { useEffect, useState } from "react";
import { Calendar, Edit, Eye, Filter, Plus, Search, Trash2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ProjectModal from "../../components/ProjectModal";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteProject,
    setFilters,
    setPagination,
    clearFilters,
    fetchProjects,
} from "../../Redux/slices/admin/adminProjectSlice";
import { fetchClients } from "../../Redux/slices/admin/adminClientSlice";
import { fetchMembers } from "../../Redux/slices/admin/adminStaffSlice";

const Projects = () => {
    const dispatch = useDispatch();
    const { projects, filters, pagination, loading } = useSelector((state) => state.projects);
    const { clients } = useSelector((state) => state.clients);
    const { members } = useSelector((state) => state.staffs);


    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        dispatch(fetchProjects({ ...filters, page: pagination.page }));
        dispatch(fetchClients())
        dispatch(fetchMembers())
    }, [dispatch, filters, pagination.page]);

    const handleSearch = (e) => {
        dispatch(setFilters({ search: e.target.value }));
        dispatch(setPagination({ page: 1 }));
    };

    const handleFilterStatus = (e) => {
        dispatch(setFilters({ status: e.target.value === "All" ? "" : e.target.value }));
        dispatch(setPagination({ page: 1 }));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            dispatch(deleteProject(id));
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            dispatch(setPagination({ page: newPage }));
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 space-y-6 mx-6">
                <div className="flex items-center justify-between mt-4 mb-6">
                    <Header title="Projects" description="Track and manage ongoing projects" />

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={filters.search}
                            onChange={handleSearch}
                            placeholder="Search projects..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                        />
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => dispatch(clearFilters())}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Filter size={18} />
                            <span className="text-sm">Clear Filters</span>
                        </button>
                        <select
                            value={filters.status || "All"}
                            onChange={handleFilterStatus}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option>All</option>
                            <option>New</option>
                            <option>In Progress</option>
                            <option>On Hold</option>
                            <option>Completed</option>
                            <option>Closed</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            setModalMode("add");
                            setSelectedProject(null);
                            setModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={18} />
                        <span>New Project</span>
                    </button>
                </div>

                {/* Projects Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-6 text-center text-gray-500">Loading projects...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Project</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Description</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Client</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Timeline</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Developers</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {projects.map((project) => (
                                        <tr key={project._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-gray-800 font-medium">{project.title}</td>
                                            <td className="px-6 py-4 text-gray-800 text-sm">
                                                {project.description?.length > 25
                                                    ? project.description.slice(0, 25) + "..."
                                                    : project.description}
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">{project.clientId?.name}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === "In Progress"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : project.status === "On Hold"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : project.status === "Completed"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                >
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {project.timeline?.startDate?.slice(0, 10)} → {project.timeline?.endDate?.slice(0, 10)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex -space-x-2">
                                                    {project.assignedDevelopers?.map((dev) => (
                                                        <div
                                                            key={dev._id}
                                                            className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-medium border-2 border-white"
                                                            title={dev.name}
                                                        >
                                                            {typeof dev === "object" ? dev.name?.charAt(0) : "?"}
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setModalMode("view");
                                                        setSelectedProject(project);
                                                        setModalOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setModalMode("edit");
                                                        setSelectedProject(project);
                                                        setModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 p-4 bg-white rounded-lg">
                        <div className="flex items-center gap-1">
                            {/* First Page */}
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={pagination.page === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                «
                            </button>

                            {/* Prev */}
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                ‹
                            </button>

                            {/* Page Numbers */}
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`min-w-10 px-3 py-2 rounded-lg border text-sm font-medium transition ${page === pagination.page
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Next */}
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                ›
                            </button>

                            {/* Last Page */}
                            <button
                                onClick={() => handlePageChange(pagination.totalPages)}
                                disabled={pagination.page === pagination.totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                »
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Project Modal */}
            <ProjectModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                mode={modalMode}
                projectData={selectedProject}
                clients={clients}
                developers={members}
            />
        </div>
    );
};

export default Projects;
