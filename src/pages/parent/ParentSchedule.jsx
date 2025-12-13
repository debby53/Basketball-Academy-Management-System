import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const ParentSchedule = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Schedule</h1>
                <p className="dashboard-subtitle">Upcoming events and training sessions</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Calendar view coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default ParentSchedule;
