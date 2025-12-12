import { User, ClipboardList, DollarSign } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import '../admin/Dashboard.css';

const ParentDashboard = () => {
    const stats = [
        {
            title: 'My Children',
            value: '2',
            icon: <User size={24} />,
            color: 'primary'
        },
        {
            title: 'Attendance Rate',
            value: '92%',
            icon: <ClipboardList size={24} />,
            color: 'success'
        },
        {
            title: 'Balance Due',
            value: '$150',
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
                        <div className="activity-item">
                            <div className="activity-content">
                                <p className="activity-text"><strong>Emma</strong> attended Basketball practice</p>
                                <p className="activity-time">Today at 3:00 PM</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-content">
                                <p className="activity-text"><strong>Jake</strong> received positive feedback</p>
                                <p className="activity-time">Yesterday</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Upcoming Sessions">
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-content">
                                <p className="activity-text">Basketball - Emma</p>
                                <p className="activity-time">Tomorrow at 3:00 PM</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ParentDashboard;
