import {
    Edit, Eye, Filter, Mail, Plus, Search, Trash2, Building2, MapPin, FolderKanban,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
    Phone
} from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ClientModal from "../../components/ClientModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients, addClient, updateClient, deleteClient, setPagination } from "../../Redux/slices/admin/adminClientSlice";
import toast from "react-hot-toast";

const Clients = () => {
    const dispatch = useDispatch();
    const { clients, pagination, loading, error } = useSelector((state) => state.clients);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedClient, setSelectedClient] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const filters = {
            page: pagination.currentPage,
            limit: pagination.limit
        };
        if (filterStatus !== "All") filters.status = filterStatus;
        if (debouncedSearch) filters.search = debouncedSearch;

        dispatch(fetchClients(filters));
    }, [dispatch, filterStatus, debouncedSearch, pagination.currentPage, pagination.limit]);

    useEffect(() => {
        if (pagination.currentPage !== 1) {
            dispatch(setPagination({ currentPage: 1 }));
        }
    }, [filterStatus, debouncedSearch]);

    const handleAddClient = async (newClient) => {
        try {
            await dispatch(addClient(newClient)).unwrap();
            toast.success("Client added successfully!");
            setShowModal(false);
        } catch (err) {
            toast.error(err || "Failed to add client");
        }
    };

    const handleUpdateClient = async (updatedClient) => {
        try {
            await dispatch(updateClient({
                id: updatedClient._id,
                clientData: updatedClient
            })).unwrap();
            toast.success("Client updated successfully!");
            setShowModal(false);
        } catch (err) {
            toast.error(err || "Failed to update client");
        }
    };

    const handleDeleteClient = async (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            try {
                await dispatch(deleteClient(id)).unwrap();
                toast.success("Client deleted successfully!");
            } catch (err) {
                toast.error(err || "Failed to delete client");
            }
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            dispatch(setPagination({ currentPage: newPage }));
        }
    };
    const handleFirstPage = () => handlePageChange(1);
    const handleLastPage = () => handlePageChange(pagination.totalPages);
    const handlePreviousPage = () => handlePageChange(pagination.currentPage - 1);
    const handleNextPage = () => handlePageChange(pagination.currentPage + 1);

    const generatePageNumbers = () => {
        const pages = [];
        const { currentPage, totalPages } = pagination;
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
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
                        <p className="mt-4 text-gray-600">Loading clients...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-auto mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mt-4 mb-6">
                    <Header title={"Clients"} description={"Manage your client relationships"} />
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Filter size={18} />
                            <span className="text-sm">Filter</span>
                        </button>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option>All</option>
                            <option>New</option>
                            <option>Active</option>
                            <option>Paused</option>
                            <option>Closed</option>
                        </select>
                    </div>

                    <button
                        onClick={() => {
                            setModalMode("add");
                            setSelectedClient(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Add Client</span>
                    </button>
                </div>

                {/* Clients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {clients.map((client) => (
                        <div key={client._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                    {client.name.charAt(0).toUpperCase()}
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${client.status === "Active"
                                        ? "bg-green-100 text-green-700"
                                        : client.status === "Paused"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {client.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{client.name}</h3>
                            <div className="space-y-2 mb-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2"><Mail size={14} /> {client.email}</div>
                                <div className="flex items-center gap-2"><Phone size={14} /> {client.phone}</div>
                                <div className="flex items-center gap-2"><Building2 size={14} /> {client.company}</div>
                                <div className="flex items-center gap-2"><MapPin size={14} /> {client.address}</div>
                                <div className="flex items-center gap-2"><FolderKanban size={14} /> Projects: {client.projectCount || 0}</div>
                            </div>

                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setModalMode("view");
                                        setSelectedClient(client);
                                        setShowModal(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                                >
                                    <Eye size={16} /> View
                                </button>
                                <button
                                    onClick={() => {
                                        setModalMode("edit");
                                        setSelectedClient(client);
                                        setShowModal(true);
                                    }}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClient(client._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 mb-8">
                        <button onClick={handleFirstPage} disabled={pagination.currentPage === 1}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"><ChevronsLeft size={16} /></button>
                        <button onClick={handlePreviousPage} disabled={pagination.currentPage === 1}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>

                        {generatePageNumbers().map((page, idx) => (
                            <button
                                key={idx}
                                onClick={() => typeof page === "number" && handlePageChange(page)}
                                disabled={page === "..."}
                                className={`px-3 py-2 border rounded-lg text-sm ${pagination.currentPage === page
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button onClick={handleNextPage} disabled={pagination.currentPage === pagination.totalPages}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
                        <button onClick={handleLastPage} disabled={pagination.currentPage === pagination.totalPages}
                            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"><ChevronsRight size={16} /></button>
                    </div>
                )}

                {/* Empty state */}
                {clients.length === 0 && !loading && (
                    <div className="bg-white rounded-xl border p-12 text-center">
                        <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No clients found
                        </h3>
                        <p className="text-gray-500 mb-4">Try adjusting filters or add a new client</p>
                        <button
                            onClick={() => {
                                setModalMode("add");
                                setSelectedClient(null);
                                setShowModal(true);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            <Plus size={18} /> Add Client
                        </button>
                    </div>
                )}

                {/* Modal */}
                <ClientModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={modalMode === "add" ? handleAddClient : handleUpdateClient}
                    mode={modalMode}
                    clientData={selectedClient}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Clients;
