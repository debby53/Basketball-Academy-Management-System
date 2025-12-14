import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import AttendanceHistory from '../../components/attendance/AttendanceHistory';
import { useAuth } from '../../hooks/useAuth';
import { getParentChildren } from '../../services/parentService';
import { getAttendanceByPlayer } from '../../services/attendanceService';
import { ATTENDANCE_STATUS, DATE_FORMATS } from '../../utils/constants';

const ParentAttendance = () => {
    const { user } = useAuth();
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(true);

    const [recentEvents, setRecentEvents] = useState([]);
    const [historyEvents, setHistoryEvents] = useState([]);
    const [historyFilter, setHistoryFilter] = useState('month');
    const [historyLoading, setHistoryLoading] = useState(false);

    // Fetch children on mount
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                if (user?.id) {
                    const data = await getParentChildren(user.id);
                    setChildren(data);
                    if (data && data.length > 0) {
                        setSelectedChild(data[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching children:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChildren();
    }, [user]);

    // Fetch attendance when child or filter changes
    useEffect(() => {
        if (!selectedChild) return;

        const fetchAttendance = async () => {
            setHistoryLoading(true);
            try {
                // 1. Fetch last 5 attended events (Present only)
                const recentParams = {
                    limit: 5,
                    status: ATTENDANCE_STATUS.PRESENT,
                    sort: 'date:desc'
                };
                const recentData = await getAttendanceByPlayer(selectedChild.id, recentParams);
                setRecentEvents(recentData);

                // 2. Fetch history based on filter
                const historyParams = {
                    period: historyFilter, // Assuming backend handles 'period' or we calculate dates
                    // If backend doesn't support 'period', we would calculate startDate/endDate here
                    sort: 'date:desc'
                };

                // Calculate dates for frontend filtering if API supports dates but not 'period'
                const now = new Date();
                let startDate = new Date();

                if (historyFilter === 'week') {
                    startDate.setDate(now.getDate() - 7);
                } else if (historyFilter === 'month') {
                    startDate.setMonth(now.getMonth() - 1);
                } else if (historyFilter === 'year') {
                    startDate.setFullYear(now.getFullYear() - 1);
                }

                // Add explicit date params if needed, or pass 'period' if backend supports it.
                // For safety, let's assume we pass startDate for local filtering or optimized query
                historyParams.startDate = startDate.toISOString().split('T')[0];

                const historyData = await getAttendanceByPlayer(selectedChild.id, historyParams);
                setHistoryEvents(historyData);

            } catch (error) {
                console.error('Error fetching attendance:', error);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchAttendance();
    }, [selectedChild, historyFilter]);

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

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>Attendance Records</h1>
                    <p className="dashboard-subtitle">Track your child's training participation</p>
                </div>

                {children.length > 1 && (
                    <div className="child-selector">
                        <select
                            value={selectedChild?.id || ''}
                            onChange={(e) => {
                                const child = children.find(c => c.id === parseInt(e.target.value));
                                setSelectedChild(child);
                            }}
                            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
                        >
                            {children.map(child => (
                                <option key={child.id} value={child.id}>
                                    {child.firstName} {child.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
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
                isLoading={historyLoading}
            />
        </DashboardLayout>
    );
};

export default ParentAttendance;
