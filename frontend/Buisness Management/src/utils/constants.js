import { LayoutDashboard, Users, FolderKanban, Activity, User } from 'lucide-react';

export const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, link: '/' },
    { id: 'clients', label: 'Clients', icon: Users, link: '/clients' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, link: '/projects' },
    { id: 'activity', label: 'Activity Logs', icon: Activity, link: '/activitys' },
    { id: 'members', label: 'Members', icon: User, link: '/members' },
];