import { useState, useEffect } from 'react';
import { User, ClipboardList, DollarSign, Bell, Calendar, Clock, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import '../admin/Dashboard.css';
import { useAuth } from '../../hooks/useAuth';
import { getAllAnnouncements } from '../../services/announcementService';
import { getSchedule } from '../../services/scheduleService';
import { getParentChildren } from '../../services/parentService';

const ParentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([
        { title: 'My Children', value: '0', icon: <User size={24} />, color: 'primary' },
        { title: 'Attendance Rate', value: 'N/A', icon: <ClipboardList size={24} />, color: 'success' },
        { title: 'Balance Due', value: '$0', icon: <DollarSign size={24} />, color: 'warning' }
    ]);
    const [announcements, setAnnouncements] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) return;

            try {
                // Fetch children logic (optional for stats, but helpful for context)
                const childrenData = await getParentChildren(user.id);
                setStats(prev => prev.map(stat =>
                    stat.title === 'My Children' ? { ...stat, value: childrenData.length.toString() } : stat
                ));

                // Fetch recent announcements
                const announcementsData = await getAllAnnouncements({ limit: 5, sort: 'date:desc' });
                setAnnouncements(announcementsData || []);

                // Fetch upcoming sessions
                const today = new Date().toISOString().split('T')[0];
                const scheduleData = await getSchedule({ startDate: today, limit: 5, sort: 'date:asc' });
                setSessions(scheduleData || []);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Parent Dashboard</h1>
                <p className="dashboard-subtitle">Track your children's progress and activities</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className="stat-card">
                        <div className="stat-content">
                            <div className={`stat-icon stat-icon-${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="stat-details">
                                <p className="stat-title">{stat.title}</p>
                                <h2 className="stat-value">{stat.value}</h2>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="dashboard-grid">
                <Card title="Recent Updates">
                    <div className="activity-list">
                        {loading ? (
                            <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading updates...</p>
                        ) : announcements.length > 0 ? (
                            announcements.map((item, index) => (
                                <div key={item.id || index} className="activity-item">
                                    <div className="activity-icon bg-warning-light string-avatar">
                                        <Bell size={16} className="text-warning" />
                                    </div>
                                    <div className="activity-details">
                                        <p className="activity-title">{item.title}</p>
                                        <p className="activity-time">{formatDate(item.date)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                                No recent announcements.
                            </p>
                        )}
                    </div>
                </Card>

                <Card title="Upcoming Sessions">
                    <div className="activity-list">
                        {loading ? (
                            <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading sessions...</p>
                        ) : sessions.length > 0 ? (
                            sessions.map((session, index) => (
                                <div key={session.id || index} className="activity-item">
                                    <div className="activity-icon bg-primary-light string-avatar">
                                        <Calendar size={16} className="text-primary" />
                                    </div>
                                    <div className="activity-details">
                                        <p className="activity-title">{session.title || 'Training Session'}</p>
                                        <div className="activity-time" style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Calendar size={12} /> {formatDate(session.date)}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={12} /> {formatTime(session.date)}
                                            </span>
                                            {session.location && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <MapPin size={12} /> {session.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                                No upcoming sessions scheduled.
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ParentDashboard;
