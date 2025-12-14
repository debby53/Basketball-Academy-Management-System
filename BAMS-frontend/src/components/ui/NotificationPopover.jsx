import { useState, useRef, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markAsRead } from '../../services/notificationService';
import './NotificationPopover.css';

const NotificationPopover = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const popoverRef = useRef(null);
    const navigate = useNavigate();

    // Mock initial data if backend is not ready
    const mockNotifications = [
        {
            id: 1,
            title: 'New Player Registered',
            message: 'John Doe has registered for U13 Team.',
            time: '2 hours ago',
            read: false,
            type: 'info'
        },
        {
            id: 2,
            title: 'Payment Received',
            message: 'Received $150 from Sarah Smith.',
            time: '5 hours ago',
            read: false,
            type: 'success'
        },
        {
            id: 3,
            title: 'System Update',
            message: 'System maintenance scheduled for tonight.',
            time: '1 day ago',
            read: true,
            type: 'warning'
        }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        // Close popover when clicking outside
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            // Try to fetch from API, fall back to mock if fails (for demo purposes)
            try {
                const data = await getNotifications();
                setNotifications(data);
            } catch (error) {
                console.warn('Failed to fetch notifications from API, using mock data', error);
                setNotifications(mockNotifications);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            // Optimistic update
            const updated = notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            );
            setNotifications(updated);

            // API call
            await markAsRead([id]);
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
            if (unreadIds.length === 0) return;

            // Optimistic update
            const updated = notifications.map(n => ({ ...n, read: true }));
            setNotifications(updated);

            // API call
            await markAsRead(unreadIds);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const togglePopover = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="notification-container" ref={popoverRef}>
            <button className="navbar-icon-btn" onClick={togglePopover}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="navbar-badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-popover">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button className="mark-all-btn" onClick={handleMarkAllRead}>
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {loading ? (
                            <div className="notification-loading">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="notification-empty">No notifications</div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                >
                                    <div className="notification-content">
                                        <div className="notification-title">
                                            {notification.title}
                                            {!notification.read && <span className="unread-dot"></span>}
                                        </div>
                                        <div className="notification-text">{notification.message}</div>
                                        <div className="notification-time">{notification.time}</div>
                                    </div>
                                    {!notification.read && (
                                        <button
                                            className="notification-action"
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            title="Mark as read"
                                        >
                                            <Check size={14} />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="notification-footer">
                        <button onClick={() => navigate('/admin/communications')}>View All</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPopover;
