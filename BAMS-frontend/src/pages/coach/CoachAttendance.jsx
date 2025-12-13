import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import { getAllPlayers } from '../../services/playerService';
import { markAttendance } from '../../services/attendanceService';
import { Check, X, Save, Calendar } from 'lucide-react';

const CoachAttendance = () => {
    const [players, setPlayers] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            const response = await getAllPlayers();
            // Handle both array directly or paginated response
            const playerList = Array.isArray(response) ? response : response.data || [];

            setPlayers(playerList);

            // Initialize attendance map - default to Present (true) or Absent (false)? 
            // Usually easier if default is false (Absent) or pre-fill all as Present.
            // Let's pre-fill all as Present for convenience.
            const initialMap = {};
            playerList.forEach(p => {
                initialMap[p.id] = true;
            });
            setAttendanceMap(initialMap);

        } catch (error) {
            console.error('Failed to fetch players:', error);
            setNotification({ type: 'error', message: 'Failed to load players.' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAttendance = (playerId) => {
        setAttendanceMap(prev => ({
            ...prev,
            [playerId]: !prev[playerId]
        }));
    };

    const handleSaveAttendance = async () => {
        setSaving(true);
        try {
            // Prepare payload
            const attendanceList = players.map(player => ({
                playerId: player.id,
                status: attendanceMap[player.id] ? 'Present' : 'Absent',
                date: selectedDate
            }));

            // In a real API we might send batch or one by one. 
            // The service markAttendance implies a single record or perhaps the backend handles a list.
            // Assuming the backend endpoint '/attendance/mark' can handle a batch or we loop.
            // For this implementation, I'll assume we send a batch object or the service needs adjustment.
            // Let's assume we send 'attendanceList' as a wrapper or array.

            await markAttendance({ date: selectedDate, records: attendanceList });

            setNotification({ type: 'success', message: 'Attendance saved successfully!' });
        } catch (error) {
            console.error('Failed to save attendance:', error);
            setNotification({ type: 'error', message: 'Failed to save attendance records.' });
        } finally {
            setSaving(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>Team Attendance</h1>
                    <p className="dashboard-subtitle">Mark present or absent for today's session</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <Calendar size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                padding: '8px 12px 8px 35px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-light)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                    <Button
                        variant="primary"
                        icon={<Save size={18} />}
                        onClick={handleSaveAttendance}
                        loading={saving}
                    >
                        Save Attendance
                    </Button>
                </div>
            </div>

            {notification && (
                <div style={{ marginBottom: '20px' }}>
                    <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
                </div>
            )}

            <Card>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading players...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Player Name</th>
                                    <th>Status</th>
                                    <th style={{ width: '150px' }}>Mark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.length > 0 ? (
                                    players.map(player => (
                                        <tr key={player.id}>
                                            <td>
                                                <div className="user-info">
                                                    <div className="user-avatar">{player.name?.charAt(0) || 'P'}</div>
                                                    <div className="user-details">
                                                        <span className="user-name">{player.name}</span>
                                                        <span className="user-role">{player.position || 'Player'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${attendanceMap[player.id] ? 'success' : 'error'}`}>
                                                    {attendanceMap[player.id] ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                            <td>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={!!attendanceMap[player.id]}
                                                        onChange={() => handleToggleAttendance(player.id)}
                                                    />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="empty-state">No players found in roster.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <style>{`
                .toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .4s;
                    border-radius: 24px;
                }
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 4px;
                    bottom: 4px;
                    background-color: white;
                    transition: .4s;
                    border-radius: 50%;
                }
                input:checked + .toggle-slider {
                    background-color: var(--primary-color);
                }
                input:checked + .toggle-slider:before {
                    transform: translateX(26px);
                }
            `}</style>
        </DashboardLayout>
    );
};

export default CoachAttendance;
