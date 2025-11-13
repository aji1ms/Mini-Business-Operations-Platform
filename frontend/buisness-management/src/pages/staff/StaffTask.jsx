import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTasks, updateTaskStatus, setFilters, setPagination } from "../../Redux/slices/staff/taskSlice";
import Header from "../../components/Header";
import StaffSidebar from "../../components/StaffSidebar";
import {
    Search,
    Filter,
    Eye,
    Edit,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import StaffTaskModal from "../../components/StaffTaskModal";

const StaffTask = () => {
    const dispatch = useDispatch();
    const { tasks, pagination, filters, loading, summary } = useSelector((s) => s.staffTasks);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const params = {
            ...filters,
            search: debouncedSearch || filters.search,
            page: pagination.page,
            limit: pagination.limit,
        };
        dispatch(fetchMyTasks(params));
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
            await dispatch(updateTaskStatus({ id, status: newStatus })).unwrap();
            toast.success("Task status updated successfully");
            dispatch(fetchMyTasks({ ...filters, page: pagination.page, limit: pagination.limit }));
            setShowModal(false);
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Failed to update task status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "In Progress": return "bg-blue-100 text-blue-800";
            case "Completed": return "bg-green-100 text-green-800";
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
                                title="Tasks"
                                description="Manage and track your assigned tasks"
                            />

                            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search tasks..."
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
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Tasks Table */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Task
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Due Date
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
                                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                    Loading tasks...
                                                </td>
                                            </tr>
                                        ) : tasks.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                    No tasks found
                                                </td>
                                            </tr>
                                        ) : (
                                            tasks.map((task) => (
                                                <tr key={task._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {task.title}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {task.description || "No description"}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {task.projectId?.title || "—"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setModalMode("view");
                                                                    setSelectedTask(task);
                                                                    setShowModal(true);
                                                                }}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setModalMode("edit");
                                                                    setSelectedTask(task);
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
                                    {summary?.totalFiltered || 0} tasks
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
                <StaffTaskModal
                    mode={modalMode}
                    task={selectedTask}
                    onClose={() => setShowModal(false)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
};

export default StaffTask;