import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const ParentAnnouncements = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Announcements</h1>
                <p className="dashboard-subtitle">News and updates from the academy</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Announcements feed coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default ParentAnnouncements;
