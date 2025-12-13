import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const PlayerProgress = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>My Progress</h1>
                <p className="dashboard-subtitle">Track your development stats</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Progress tracking coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default PlayerProgress;
