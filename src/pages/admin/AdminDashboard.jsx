import { Users, UserCheck, DollarSign, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import './Dashboard.css';

const AdminDashboard = () => {
    const stats = [
        {
            title: 'Total Players',
            value: '248',
            change: '+12%',
            icon: <Users size={24} />,
            color: 'primary'
        },
        {
            title: 'Active Coaches',
            value: '18',
            change: '+2',
            icon: <UserCheck size={24} />,
            color: 'secondary'
        },
        {
            title: 'Monthly Revenue',
            value: '$24,500',
            change: '+8%',
            icon: <DollarSign size={24} />,
            color: 'success'
        },
        {
            title: 'Attendance Rate',
            value: '87%',
            change: '+3%',
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
                        <div className="activity-item">
                            <div className="activity-dot"></div>
                            <div className="activity-content">
                                <p className="activity-text">New player registered: <strong>John Smith</strong></p>
                                <p className="activity-time">2 hours ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot"></div>
                            <div className="activity-content">
                                <p className="activity-text">Payment received from <strong>Sarah Johnson</strong></p>
                                <p className="activity-time">5 hours ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot"></div>
                            <div className="activity-content">
                                <p className="activity-text">Coach <strong>Mike Davis</strong> marked attendance</p>
                                <p className="activity-time">1 day ago</p>
                            </div>
                        </div>
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
