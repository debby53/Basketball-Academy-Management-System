import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const ParentPayments = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Payments</h1>
                <p className="dashboard-subtitle">Manage tuition and fee payments</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Payment portal coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default ParentPayments;
