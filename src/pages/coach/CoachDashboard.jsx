import { ClipboardList, Users, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import '../admin/Dashboard.css';

const CoachDashboard = () => {
    const stats = [
        {
            title: 'My Players',
            value: '32',
            icon: <Users size={24} />,
            color: 'primary'
        },
        {
            title: 'Today\'s Sessions',
            value: '3',
            icon: <ClipboardList size={24} />,
            color: 'secondary'
        },
        {
            title: 'Avg Attendance',
            value: '89%',
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
                        <div className="activity-item">
                            <div className="activity-content">
                                <p className="activity-text"><strong>U12 Basketball</strong> - 3:00 PM</p>
                                <p className="activity-time">Court A • 16 players</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-content">
                                <p className="activity-text"><strong>U14 Football</strong> - 5:00 PM</p>
                                <p className="activity-time">Field 2 • 22 players</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Quick Actions">
                    <div className="quick-actions">
                        <button className="action-btn">
                            <ClipboardList size={20} />
                            <span>Mark Attendance</span>
                        </button>
                        <button className="action-btn">
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
