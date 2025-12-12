import { ClipboardList, TrendingUp, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import '../admin/Dashboard.css';

const PlayerDashboard = () => {
    // TODO: Fetch player stats from API
    const stats = [
        {
            title: 'Attendance Rate',
            value: '0%',
            icon: <ClipboardList size={24} />,
            color: 'success'
        },
        {
            title: 'Training Sessions',
            value: '0',
            icon: <Calendar size={24} />,
            color: 'primary'
        },
        {
            title: 'Performance',
            value: 'N/A',
            icon: <TrendingUp size={24} />,
            color: 'secondary'
        }
    ];

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
                        {/* TODO: Fetch recent feedback from API */}
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                            No recent feedback. Data will load from backend.
                        </p>
                    </div>
                </Card>

                <Card title="Upcoming Sessions">
                    <div className="activity-list">
                        {/* TODO: Fetch upcoming sessions from API */}
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                            No upcoming sessions. Data will load from backend.
                        </p>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default PlayerDashboard;
