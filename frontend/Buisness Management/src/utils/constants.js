import { LayoutDashboard, Users, FolderKanban, Activity, User } from 'lucide-react';

export const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: '/admin/' },
    { id: 'clients', label: 'Clients', icon: Users, link: '/admin/clients' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, link: '/admin/projects' },
    { id: 'activity', label: 'Activity Logs', icon: Activity, link: '/admin/activitys' },
    { id: 'members', label: 'Members', icon: User, link: '/admin/members' },
];