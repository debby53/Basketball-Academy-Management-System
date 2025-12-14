import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import AttendanceHistory from '../../components/attendance/AttendanceHistory';
import { useAuth } from '../../hooks/useAuth';
import { getAttendanceByPlayer } from '../../services/attendanceService';
import { ATTENDANCE_STATUS } from '../../utils/constants';

const PlayerAttendance = () => {
    const { user } = useAuth();

    // State
    const [recentEvents, setRecentEvents] = useState([]);
    const [historyEvents, setHistoryEvents] = useState([]);
    const [historyFilter, setHistoryFilter] = useState('month');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Fetch attendance data
    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch last 5 attended events (Present only)
                // Only fetch recent ones on initial load to save bandwidth if possible, 
                // but checking dependency array, we might want to refresh them if needed.
                // For now, let's fetch them every time the effect runs (which is mainly on filter change for history),
                // but we should probably decouple them.
                // Let's rely on the fact that these run in parallel.

                const recentPromise = getAttendanceByPlayer(user.id, {
                    limit: 5,
                    status: ATTENDANCE_STATUS.PRESENT,
                    sort: 'date:desc'
                });

                // 2. Fetch history based on filter
                const now = new Date();
                let startDate = new Date();

                if (historyFilter === 'week') {
                    startDate.setDate(now.getDate() - 7);
                } else if (historyFilter === 'month') {
                    startDate.setMonth(now.getMonth() - 1);
                } else if (historyFilter === 'year') {
                    startDate.setFullYear(now.getFullYear() - 1);
                }

                const historyPromise = getAttendanceByPlayer(user.id, {
                    startDate: startDate.toISOString().split('T')[0],
                    sort: 'date:desc'
                });

                const [recentData, historyData] = await Promise.all([recentPromise, historyPromise]);

                setRecentEvents(recentData);
                setHistoryEvents(historyData);

            } catch (error) {
                console.error('Error fetching attendance:', error);
            } finally {
                setLoading(false);
                setInitialLoading(false);
            }
        };

        fetchData();
    }, [user, historyFilter]);

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    if (initialLoading) {
        return (
            <DashboardLayout>
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading attendance records...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <h1>My Attendance</h1>
                <p className="dashboard-subtitle">Track your training sessions and game presence</p>
            </div>

            {/* Last 5 Attended Events */}
            <Card title="Recents: Last 5 Attended" className="mb-6">
                <div className="recent-events-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '1rem',
                    padding: '0.5rem'
                }}>
                    {recentEvents.length > 0 ? (
                        recentEvents.map((event, index) => (
                            <div key={event.id || index} style={{
                                padding: '1rem',
                                background: '#f8fafc',
                                borderRadius: '0.5rem',
                                border: '1px solid #e2e8f0',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#334155' }}>
                                    {formatDate(event.date)}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                    {event.eventName || 'Training'}
                                </div>
                                <div style={{
                                    marginTop: '0.5rem',
                                    display: 'inline-block',
                                    padding: '0.125rem 0.5rem',
                                    background: '#dcfce7',
                                    color: '#166534',
                                    borderRadius: '999px',
                                    fontSize: '0.7rem',
                                    fontWeight: '600'
                                }}>
                                    {event.status}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ gridColumn: '1/-1', color: '#64748b', textAlign: 'center' }}>
                            No recent attended events found.
                        </p>
                    )}
                </div>
            </Card>

            {/* Comprehensive History */}
            <AttendanceHistory
                events={historyEvents}
                filter={historyFilter}
                onFilterChange={setHistoryFilter}
                isLoading={loading}
            />
        </DashboardLayout>
    );
};

export default PlayerAttendance;
