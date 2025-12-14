import { useState, useEffect } from 'react';
import { ClipboardList, TrendingUp, Calendar, Clock, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import '../admin/Dashboard.css';
import { useAuth } from '../../hooks/useAuth';
import { getPlayerPerformance } from '../../services/performanceService';
import { getSchedule } from '../../services/scheduleService';

const PlayerDashboard = () => {
    const { user } = useAuth();
    const [performance, setPerformance] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) return;

            try {
                // Fetch recent performance feedback
                const performanceData = await getPlayerPerformance(user.id, { limit: 5, sort: 'date:desc' });
                setPerformance(performanceData || []);

                // Fetch upcoming sessions
                // Assuming the backend filters by date >= now if not specified, or we pass a startDate
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

    // TODO: meaningful stats calculation or fetch from a dedicated stats endpoint
    const stats = [
        {
            title: 'Attendance Rate',
            value: '85%', // Placeholder until real stats endpoint exists
            icon: <ClipboardList size={24} />,
            color: 'success'
        },
        {
            title: 'Upcoming Sessions',
            value: sessions.length.toString(),
            icon: <Calendar size={24} />,
            color: 'primary'
        },
        {
            title: 'Recent Feedback',
            value: performance.length.toString(),
            icon: <TrendingUp size={24} />,
            color: 'secondary'
        }
    ];

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
                <h1>Player Dashboard</h1>
                <p className="dashboard-subtitle">Track your progress and upcoming sessions</p>
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
                <Card title="Recent Feedback">
                    <div className="activity-list">
                        {loading ? (
                            <p style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading feedback...</p>
                        ) : performance.length > 0 ? (
                            performance.map((item, index) => (
                                <div key={item.id || index} className="activity-item">
                                    <div className="activity-icon bg-secondary-light string-avatar">
                                        <TrendingUp size={16} className="text-secondary" />
                                    </div>
                                    <div className="activity-details">
                                        <p className="activity-title">{item.feedback || 'Performance Review'}</p>
                                        <p className="activity-time">
                                            {formatDate(item.date)} - {item.rating}/10
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                                No recent feedback available.
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

export default PlayerDashboard;
