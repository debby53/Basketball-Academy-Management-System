import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const PlayerSchedule = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>My Schedule</h1>
                <p className="dashboard-subtitle">Upcoming games and trainings</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Schedule features coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default PlayerSchedule;
