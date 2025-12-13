import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const CoachPerformance = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Player Performance</h1>
                <p className="dashboard-subtitle">Analyze player statistics and progress</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Performance tracking features coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default CoachPerformance;
