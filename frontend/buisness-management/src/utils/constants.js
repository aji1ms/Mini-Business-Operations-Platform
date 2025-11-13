import { LayoutDashboard, Users, FolderKanban, Activity, User, ClipboardList } from 'lucide-react';

export const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: '/admin/' },
    { id: 'clients', label: 'Clients', icon: Users, link: '/admin/clients' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, link: '/admin/projects' },
    { id: 'task', label: 'Tasks', icon: ClipboardList, link: '/admin/tasks' },
    { id: 'members', label: 'Members', icon: User, link: '/admin/members' },
    { id: 'activity', label: 'Activity Logs', icon: Activity, link: '/admin/activitys' },
];

export const staffNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: '/' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, link: '/staff/projects' },
    { id: 'task', label: 'Tasks', icon: ClipboardList, link: '/staff/tasks' },
];