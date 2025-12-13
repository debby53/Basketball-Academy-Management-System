import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const CoachRoster = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Team Roster</h1>
                <p className="dashboard-subtitle">View and manage your players</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Roster management features coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default CoachRoster;
