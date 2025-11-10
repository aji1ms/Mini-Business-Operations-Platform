import { Building2, Edit, Eye, Filter, FolderKanban, Mail, MapPin, NotebookText, Phone, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ClientModal from "../components/ClientModal";

const clients = [
    {
        id: 1, name: 'Acme Corp', email: 'contact@acme.com', phone: '+1 234 567 8900', status: 'Active', projects: 3, createdAt: '2024-01-15', company: 'Nike', address: '123 villa USA', note: 'this is our first client'
    },
    {
        id: 2, name: 'Tech Solutions Inc', email: 'info@techsol.com', phone: '+1 234 567 8901', status: 'Active', projects: 2, createdAt: '2024-02-20',
        company: 'Nike', address: '123 villa USA', note: 'this is our first client'
    },
    {
        id: 3, name: 'Global Enterprises', email: 'hello@global.com', phone: '+1 234 567 8902', status: 'Paused', projects: 1, createdAt: '2024-03-10',
        company: 'Nike', address: '123 villa USA', note: 'this is our first client'
    },
];

const Clients = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedClient, setSelectedClient] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredClients = filterStatus === 'All'
        ? clients
        : clients.filter(c => c.status === filterStatus);

    const handleAddClient = (newClient) => {
        setClientList((prev) => [...prev, newClient]);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <div className="flex-1 overflow-auto mx-4">
                <div className="flex items-center justify-between mt-4 mb-6">
                    <Header title={"Clients"} description={"Manage your client relationships"} />

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
                        />
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between">
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
                            <option>Active</option>
                            <option>Paused</option>
                            <option>New</option>
                            <option>Closed</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            setModalMode("add");
                            setSelectedClient(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={18} />
                        <span>Add Client</span>
                    </button>
                </div>

                {/* Clients Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                    {filteredClients.map(client => (
                        <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                                    {client.name.charAt(0)}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${client.status === 'Active' ? 'bg-green-100 text-green-700' :
                                    client.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                    {client.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{client.name}</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail size={14} />
                                    <span>{client.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone size={14} />
                                    <span>{client.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Building2 size={14} />
                                    <span>{client.company} Company</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin size={14} />
                                    <span>{client.address} Address</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <NotebookText size={14} />
                                    <span>{client.note} Note</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FolderKanban size={14} />
                                    <span>{client.projects} Projects</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => {
                                        setModalMode("view");
                                        setSelectedClient(client);
                                        setShowModal(true);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm">
                                    <Eye size={16} />
                                    View
                                </button>
                                <button
                                    onClick={() => {
                                        setModalMode("edit");
                                        setSelectedClient(client);
                                        setShowModal(true);
                                    }}
                                    className="flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                    <Edit size={16} />
                                </button>
                                <button className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Client Modal */}
                <ClientModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAddClient}
                    mode={modalMode}
                    clientData={selectedClient}
                />
            </div>
        </div>
    );
};

export default Clients;
