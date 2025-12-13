import { ClipboardList, Users, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import '../admin/Dashboard.css';

const CoachDashboard = () => {
    const navigate = useNavigate();

    // TODO: Fetch coach stats from API
    const stats = [
        {
            title: 'My Players',
            value: '0',
            icon: <Users size={24} />,
            color: 'primary'
        },
        {
            title: 'Today\'s Sessions',
            value: '0',
            icon: <ClipboardList size={24} />,
            color: 'secondary'
        },
        {
            title: 'Avg Attendance',
            value: '0%',
            icon: <TrendingUp size={24} />,
            color: 'success'
        }
    ];

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Coach Dashboard</h1>
                <p className="dashboard-subtitle">Manage your team and track progress</p>
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
                <Card title="Today's Sessions">
                    <div className="activity-list">
                        {/* TODO: Fetch today's sessions from API */}
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                            No sessions scheduled. Data will load from backend.
                        </p>
                    </div>
                </Card>

                <Card title="Quick Actions">
                    <div className="quick-actions">
                        <button className="action-btn" onClick={() => navigate('/coach/attendance')}>
                            <ClipboardList size={20} />
                            <span>Mark Attendance</span>
                        </button>
                        <button className="action-btn" onClick={() => navigate('/coach/performance')}>
                            <TrendingUp size={20} />
                            <span>Log Performance</span>
                        </button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default CoachDashboard;
