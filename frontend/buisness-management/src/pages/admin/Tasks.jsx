import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask, setFilters, setPagination, addTask, updateTask } from "../../Redux/slices/admin/adminTaskSlice";
import { fetchProjects } from "../../Redux/slices/admin/adminProjectSlice";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import TaskModal from "../../components/TaskModal";
import {
    Search,
    Plus,
    Filter,
    Calendar,
    User,
    ClipboardList,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    NotepadText,
} from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/StatCard";


const Tasks = () => {
    const dispatch = useDispatch();
    const { tasks, pagination, filters, loading, summary, error } = useSelector((s) => s.tasks);
    const { projects } = useSelector((s) => s.projects);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(t);
    }, [searchQuery]);

    useEffect(() => {
        const apiFilters = {
            ...filters,
            search: debouncedSearch || filters.search,
            page: pagination.page,
            limit: pagination.limit,
        };
        dispatch(fetchTasks(apiFilters));
        if (!projects || projects.length === 0) dispatch(fetchProjects());
    }, [dispatch, filters, debouncedSearch, pagination.page, pagination.limit, projects.length]);

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
        if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
            dispatch(setPagination({ page: newPage }));
        }
    };
    const handleFirstPage = () => handlePageChange(1);
    const handleLastPage = () => handlePageChange(pagination.totalPages || 1);
    const handlePreviousPage = () => handlePageChange((pagination.page || 1) - 1);
    const handleNextPage = () => handlePageChange((pagination.page || 1) + 1);

    const handleAddTask = async (taskPayload) => {
        try {
            await dispatch(addTask(taskPayload)).unwrap();
            toast.success("Task added");
            setShowModal(false);
            dispatch(fetchTasks({ ...filters, search: debouncedSearch, page: pagination.page, limit: pagination.limit }));
        } catch (err) {
            toast.error(typeof err === "string" ? err : err?.message || "Failed to add task");
        }
    };

    const handleUpdateTask = async (taskPayload) => {
        try {
            const id = selectedTask?._id || selectedTask?.id;
            await dispatch(updateTask({ id, taskData: taskPayload })).unwrap();
            toast.success("Task updated");
            setShowModal(false);
            dispatch(fetchTasks({ ...filters, search: debouncedSearch, page: pagination.page, limit: pagination.limit }));
        } catch (err) {
            toast.error(typeof err === "string" ? err : err?.message || "Failed to update task");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await dispatch(deleteTask(id)).unwrap();
            toast.success("Task deleted");
            dispatch(fetchTasks({ ...filters, search: debouncedSearch, page: pagination.page, limit: pagination.limit }));
        } catch (err) {
            toast.error(typeof err === "string" ? err : err?.message || "Failed to delete task");
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        const current = pagination.page || 1;
        const total = pagination.totalPages || 1;
        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i);
        } else {
            if (current <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push("...");
                pages.push(total);
            } else if (current >= total - 3) {
                pages.push(1);
                pages.push("...");
                for (let i = total - 4; i <= total; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = current - 1; i <= current + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(total);
            }
        }
        return pages;
    };

    const formattedTasks = Array.isArray(tasks)
        ? tasks.map((t) => ({
            id: t._id || t.id,
            _id: t._id,
            title: t.title,
            description: t.description,
            projectId: t.projectId,
            assignedTo: t.assignedTo,
            dueDate: t.dueDate,
            status: t.status,
            createdAt: t.createdAt,
        }))
        : [];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                <div className="space-y-6 mx-6">
                    <div className="flex items-center justify-between mt-4 mb-6">
                        <Header title="Tasks" description="Assign and manage project tasks" />
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <StatCard
                            title={"Total Tasks"}
                            value={summary?.totalTasks}
                            icon={<NotepadText className="w-6 h-6 text-purple-600" />}
                        />
                        <StatCard
                            title={"Pending"}
                            value={summary?.pendingTasks}
                            icon={<NotepadText className="w-6 h-6 text-red-600" />}
                        />
                        <StatCard
                            title={"Progress"}
                            value={summary?.taskInProgress}
                            icon={<NotepadText className="w-6 h-6 text-yellow-600" />}
                        />
                        <StatCard
                            title={"Completed"}
                            value={summary?.completedTasks}
                            icon={<NotepadText className="w-6 h-6 text-green-600" />}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50">
                                <Filter size={18} />
                                <span className="text-sm">Filter</span>
                            </button>
                            <select value={filters.status || "All"} onChange={handleStatusFilter} className="px-3 py-2 border rounded-lg">
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <button
                            onClick={() => { setModalMode("add"); setSelectedTask(null); setShowModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            <Plus size={18} />
                            New Task
                        </button>
                    </div>


                    {/* Task Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Task</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Project</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned To</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Due Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-8 text-gray-500">
                                                <div className="flex items-center justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                                                    Loading tasks...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : formattedTasks.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-8 text-gray-500">
                                                <ClipboardList size={48} className="mx-auto text-gray-400 mb-3" />
                                                <p className="text-lg font-medium text-gray-900 mb-2">No tasks found</p>
                                                <p className="text-gray-600 mb-4">Try adjusting your filters or create a new task</p>
                                                <button
                                                    onClick={() => {
                                                        setModalMode("add");
                                                        setSelectedTask(null);
                                                        setShowModal(true);
                                                    }}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                >
                                                    <Plus size={18} />
                                                    Create Your First Task
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        formattedTasks.map((task) => (
                                            <tr key={task.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <ClipboardList size={16} className="text-blue-500" />
                                                        <span className="font-medium text-gray-900">{task.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {task.projectId?.title || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {task.description?.length > 50
                                                        ? task.description.slice(0, 50) + "..."
                                                        : task.description || "—"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <User size={14} className="text-gray-400" />
                                                        {task.assignedTo?.name || "—"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 text-xs font-medium rounded-full ${task.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : task.status === "In Progress"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-green-100 text-green-700"
                                                            }`}
                                                    >
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
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                            title="View task"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setModalMode("edit");
                                                                setSelectedTask(task);
                                                                setShowModal(true);
                                                            }}
                                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                                            title="Edit task"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(task.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="Delete task"
                                                        >
                                                            <Trash2 size={16} />
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</div>

                            <div className="flex items-center gap-1">
                                <button onClick={handleFirstPage} disabled={pagination.page === 1} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                    <ChevronsLeft size={16} />
                                </button>
                                <button onClick={handlePreviousPage} disabled={pagination.page === 1} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                    <ChevronLeft size={16} />
                                </button>

                                {generatePageNumbers().map((p, i) => (
                                    <button key={i} onClick={() => typeof p === "number" && handlePageChange(p)} disabled={p === "..."} className={`min-w-10 px-3 py-2 rounded-lg border text-sm ${p === pagination.page ? "bg-blue-600 text-white border-blue-600" : p === "..." ? "border-transparent text-gray-500" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                                        {p}
                                    </button>
                                ))}

                                <button onClick={handleNextPage} disabled={pagination.page === pagination.totalPages} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                    <ChevronRight size={16} />
                                </button>
                                <button onClick={handleLastPage} disabled={pagination.page === pagination.totalPages} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                    <ChevronsRight size={16} />
                                </button>
                            </div>

                            <div className="text-sm text-gray-600">{summary?.totalTasks || 0} total tasks</div>
                        </div>
                    )}
                </div>
            </div>

            <TaskModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                mode={modalMode}
                taskData={selectedTask}
                projects={projects}
                onSubmit={modalMode === "add" ? handleAddTask : handleUpdateTask}
            />
        </div>
    );
};

export default Tasks;
