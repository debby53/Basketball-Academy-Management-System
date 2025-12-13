import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const ParentAttendance = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Attendance Records</h1>
                <p className="dashboard-subtitle">View your children's attendance history</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Attendance records coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default ParentAttendance;
