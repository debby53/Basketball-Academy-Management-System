import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const CoachSchedule = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Team Schedule</h1>
                <p className="dashboard-subtitle">Upcoming games and training sessions</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Schedule management features coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default CoachSchedule;
