import { Calendar, Edit, Eye, Filter, Plus, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";
import ProjectModal from "../components/ProjectModal";

const projects = [
    { id: 1, title: 'E-commerce Platform', client: 'Acme Corp', status: 'In Progress', progress: 65, deadline: '2024-12-15', assignees: ['John', 'Sarah'], tasks: 24 },
    { id: 2, title: 'Mobile App Development', client: 'Tech Solutions Inc', status: 'In Progress', progress: 40, deadline: '2024-11-30', assignees: ['Mike', 'Emma'], tasks: 18 },
    { id: 3, title: 'Dashboard Redesign', client: 'Global Enterprises', status: 'On Hold', progress: 20, deadline: '2024-12-20', assignees: ['Anna'], tasks: 12 },
];

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

const Projects = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedProject, setSelectedProject] = useState(null);

    const handleAddProject = (project) => {
        console.log("Project Added/Edited:", project);
        setModalOpen(false);
    };
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />

            <div className="flex-1 space-y-6 mx-6">
                <div className="flex items-center justify-between mt-4 mb-6">
                    <Header title={"Projects"} description={"Track and manage ongoing projects"} />

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
                            <span className="text-sm">Filter by Status</span>
                        </button>
                        <select
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option>All</option>
                            <option>In progress</option>
                            <option>On hold</option>
                            <option>New</option>
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
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Project</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Client</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Progress</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Deadline</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Team</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {projects.map(project => (
                                    <tr key={project.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{project.title}</p>
                                                <p className="text-sm text-gray-500">{project.tasks} tasks</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{project.client}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600">{project.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <Calendar size={14} />
                                                {project.deadline}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex -space-x-2">
                                                {project.assignees.map((name, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                                        title={name}
                                                    >
                                                        {name.charAt(0)}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setModalMode("view");
                                                        setSelectedProject(project);
                                                        setModalOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setModalMode("edit");
                                                        setSelectedProject(project);
                                                        setModalOpen(true);
                                                    }}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ProjectModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddProject}
                clients={clients}
                mode={modalMode}
                projectData={selectedProject}
            />
        </div>
    );
}

export default Projects;
