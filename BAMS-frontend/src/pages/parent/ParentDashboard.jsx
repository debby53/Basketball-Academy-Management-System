import { User, ClipboardList, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import '../admin/Dashboard.css';

const ParentDashboard = () => {
    // TODO: Fetch parent stats from API
    const stats = [
        {
            title: 'My Children',
            value: '0',
            icon: <User size={24} />,
            color: 'primary'
        },
        {
            title: 'Attendance Rate',
            value: '0%',
            icon: <ClipboardList size={24} />,
            color: 'success'
        },
        {
            title: 'Balance Due',
            value: '$0',
            icon: <DollarSign size={24} />,
            color: 'warning'
        }
    ];

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
                        {/* TODO: Fetch recent updates from API */}
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                            No recent updates. Data will load from backend.
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

export default ParentDashboard;
