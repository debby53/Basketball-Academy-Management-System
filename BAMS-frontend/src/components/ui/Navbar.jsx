import { User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';
import './Navbar.css';

import NotificationPopover from './NotificationPopover';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-title">
                    <h2>Welcome back, {user?.firstName || user?.name}!</h2>
                    <p className="navbar-subtitle">Here's what's happening today</p>
                </div>

                <div className="navbar-actions">
                    <NotificationPopover />

                    <div className="navbar-user">
                        <div className="navbar-avatar">
                            {user?.profilePhoto ? (
                                <img src={user.profilePhoto} alt={user.name} />
                            ) : (
                                <span>{getInitials(user?.name || user?.firstName + ' ' + user?.lastName)}</span>
                            )}
                        </div>
                        <div className="navbar-user-info">
                            <div className="navbar-user-name">{user?.name || `${user?.firstName} ${user?.lastName}`}</div>
                            <div className="navbar-user-role">{user?.role}</div>
                        </div>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
