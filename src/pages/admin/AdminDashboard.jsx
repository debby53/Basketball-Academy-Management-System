import { Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react'; // Added useState import
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './Dashboard.css';

const AdminDashboard = () => {
    // TODO: Fetch stats from API
    // const [stats, setStats] = useState([]);
    // const [loading, setLoading] = useState(true);

    // Example stats structure - replace with API call
    const stats = [
        {
            title: 'Total Players',
            value: '0',
            change: '+0%',
            icon: <Users size={24} />,
            color: 'primary'
        },
        {
            title: 'Active Coaches',
            value: '0',
            change: '+0',
            icon: <UserCheck size={24} />,
            color: 'secondary'
        },
        {
            title: 'Monthly Revenue',
            value: '$0',
            change: '+0%',
            icon: <DollarSign size={24} />,
            color: 'success'
        },
        {
            title: 'Attendance Rate',
            value: '0%',
            change: '+0%',
            icon: <TrendingUp size={24} />,
            color: 'info'
        }
    ];

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p className="dashboard-subtitle">Overview of your sports management platform</p>
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
                                <p className="stat-change positive">{stat.change} from last month</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="dashboard-grid">
                <Card title="Recent Activity" className="activity-card">
                    <div className="activity-list">
                        {/* TODO: Fetch recent activity from API */}
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--space-4)' }}>
                            No recent activity. Data will load from backend.
                        </p>
                    </div>
                </Card>

                <Card title="Quick Actions" className="actions-card">
                    <div className="quick-actions">
                        <button className="action-btn">
                            <Users size={20} />
                            <span>Add New Player</span>
                        </button>
                        <button className="action-btn">
                            <UserCheck size={20} />
                            <span>Add Coach</span>
                        </button>
                        <button className="action-btn">
                            <DollarSign size={20} />
                            <span>Record Payment</span>
                        </button>
                        <button className="action-btn">
                            <TrendingUp size={20} />
                            <span>View Reports</span>
                        </button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
