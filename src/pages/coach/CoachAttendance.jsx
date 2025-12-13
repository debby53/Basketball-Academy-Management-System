import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';

const CoachAttendance = () => {
    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>Team Attendance</h1>
                <p className="dashboard-subtitle">Track and manage attendance records</p>
            </div>
            <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p>Attendance management features coming soon.</p>
                </div>
            </Card>
        </DashboardLayout>
    );
};

export default CoachAttendance;
