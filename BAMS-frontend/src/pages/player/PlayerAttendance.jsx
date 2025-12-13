import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const PlayerAttendance = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>My Attendance</h1>
                <p className="dashboard-subtitle">View your attendance record</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Attendance features coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default PlayerAttendance;
