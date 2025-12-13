import { Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getDashboardStats, getRecentActivity } from '../../services/dashboardService';
import './Dashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, activityData] = await Promise.all([
                getDashboardStats(),
                getRecentActivity()
            ]);

            // Mapped to standard format if API returns different structure
            // Assuming API returns array of stats objects similar to what UI expects
            setStats(Array.isArray(statsData) ? statsData : [
                {
                    title: 'Total Players',
                    value: statsData?.totalPlayers || '0',
                    change: statsData?.playerChange || '+0%',
                    icon: <Users size={24} />,
                    color: 'primary'
                },
                {
                    title: 'Active Coaches',
                    value: statsData?.activeCoaches || '0',
                    change: statsData?.coachChange || '+0',
                    icon: <UserCheck size={24} />,
                    color: 'secondary'
                },
                {
                    title: 'Monthly Revenue',
                    value: statsData?.monthlyRevenue || '$0',
                    change: statsData?.revenueChange || '+0%',
                    icon: <DollarSign size={24} />,
                    color: 'success'
                },
                {
                    title: 'Attendance Rate',
                    value: statsData?.attendanceRate || '0%',
                    change: statsData?.attendanceChange || '+0%',
                    icon: <TrendingUp size={24} />,
                    color: 'info'
                }
            ]);

            setActivities(Array.isArray(activityData) ? activityData : []);

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p className="dashboard-subtitle">Overview of your sports management platform</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                    <LoadingSpinner />
                </div>
            ) : (
                <>
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
                                        <p className="stat-change positive">{stat.change} from last month</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="dashboard-grid">
                        <Card title="Recent Activity" className="activity-card">
                            <div className="activity-list">
                                {activities.length > 0 ? (
                                    activities.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            <div className="activity-dot"></div>
                                            <div className="activity-content">
                                                <p className="activity-text">{activity.description}</p>
                                                <p className="activity-time">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                                        No recent activity found.
                                    </p>
                                )}
                            </div>
                        </Card>

                        <Card title="Quick Actions" className="actions-card">
                            <div className="quick-actions">
                                <button className="action-btn" onClick={() => navigate('/admin/players')}>
                                    <Users size={20} />
                                    <span>Add New Player</span>
                                </button>
                                <button className="action-btn" onClick={() => navigate('/admin/coaches')}>
                                    <UserCheck size={20} />
                                    <span>Add Coach</span>
                                </button>
                                <button className="action-btn" onClick={() => navigate('/admin/payments')}>
                                    <DollarSign size={20} />
                                    <span>Record Payment</span>
                                </button>
                                <button className="action-btn" onClick={() => navigate('/admin/reports')}>
                                    <TrendingUp size={20} />
                                    <span>View Reports</span>
                                </button>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
};

export default AdminDashboard;
