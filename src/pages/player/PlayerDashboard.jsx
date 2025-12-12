import { ClipboardList, TrendingUp, Calendar } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import '../admin/Dashboard.css';

const PlayerDashboard = () => {
    const stats = [
        {
            title: 'Attendance Rate',
            value: '94%',
            icon: <ClipboardList size={24} />,
            color: 'success'
        },
        {
            title: 'Training Sessions',
            value: '48',
            icon: <Calendar size={24} />,
            color: 'primary'
        },
        {
            title: 'Performance',
            value: 'Excellent',
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
                        <div className="activity-item">
                            <div className="activity-content">
                                <p className="activity-text">Great improvement in ball handling!</p>
                                <p className="activity-time">Coach Mike • 2 days ago</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-content">
                                <p className="activity-text">Excellent teamwork during practice</p>
                                <p className="activity-time">Coach Sarah • 1 week ago</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Upcoming Sessions">
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-content">
                                <p className="activity-text">Basketball Practice</p>
                                <p className="activity-time">Tomorrow at 3:00 PM</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-content">
                                <p className="activity-text">Team Scrimmage</p>
                                <p className="activity-time">Friday at 4:00 PM</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default PlayerDashboard;
