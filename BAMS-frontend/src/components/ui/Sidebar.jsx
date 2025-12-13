import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    UsersRound,
    DollarSign,
    MessageSquare,
    BarChart3,
    ClipboardList,
    Calendar,
    TrendingUp,
    Bell,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const getMenuItems = () => {
        switch (user?.role) {
            case ROLES.ADMIN:
                return [
                    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                    { path: '/admin/users', icon: <UsersRound size={20} />, label: 'User Management' },
                    { path: '/admin/players', icon: <Users size={20} />, label: 'Players' },
                    { path: '/admin/coaches', icon: <UserCheck size={20} />, label: 'Coaches' },
                    { path: '/admin/parents', icon: <UsersRound size={20} />, label: 'Parents' },
                    { path: '/admin/payments', icon: <DollarSign size={20} />, label: 'Payments' },
                    { path: '/admin/communications', icon: <MessageSquare size={20} />, label: 'Communications' },
                    { path: '/admin/reports', icon: <BarChart3 size={20} />, label: 'Reports' }
                ];

            case ROLES.COACH:
                return [
                    { path: '/coach', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                    { path: '/coach/attendance', icon: <ClipboardList size={20} />, label: 'Attendance' },
                    { path: '/coach/roster', icon: <Users size={20} />, label: 'Roster' },
                    { path: '/coach/performance', icon: <TrendingUp size={20} />, label: 'Performance' },
                    { path: '/coach/schedule', icon: <Calendar size={20} />, label: 'Schedule' }
                ];

            case ROLES.PARENT:
                return [
                    { path: '/parent', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                    { path: '/parent/attendance', icon: <ClipboardList size={20} />, label: 'Attendance' },
                    { path: '/parent/progress', icon: <TrendingUp size={20} />, label: 'Progress' },
                    { path: '/parent/payments', icon: <DollarSign size={20} />, label: 'Payments' },
                    { path: '/parent/announcements', icon: <Bell size={20} />, label: 'Announcements' },
                    { path: '/parent/schedule', icon: <Calendar size={20} />, label: 'Schedule' }
                ];

            case ROLES.PLAYER:
                return [
                    { path: '/player', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
                    { path: '/player/attendance', icon: <ClipboardList size={20} />, label: 'My Attendance' },
                    { path: '/player/progress', icon: <TrendingUp size={20} />, label: 'My Progress' },
                    { path: '/player/schedule', icon: <Calendar size={20} />, label: 'Schedule' }
                ];

            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <div className="logo-icon">⚽</div>
                    <h1 className="logo-text">Sports Hub</h1>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === `/${user?.role?.toLowerCase()}`}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                        }
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        <span className="sidebar-link-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
