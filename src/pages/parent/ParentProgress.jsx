import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const ParentProgress = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Progress Report</h1>
                <p className="dashboard-subtitle">Track skill development and performance</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Progress reports coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default ParentProgress;
