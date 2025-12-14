import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download } from 'lucide-react';
import { getRevenueData, getAttendanceStats, getDetailedAttendance } from '../../services/reportService';
import './Management.css';

const ReportsManagement = () => {
    const [period, setPeriod] = useState('month');
    const [showDetailedAttendance, setShowDetailedAttendance] = useState(false);
    const [loading, setLoading] = useState(true);
    const [revenueData, setRevenueData] = useState([]);
    const [attendanceStats, setAttendanceStats] = useState({
        average: '0%',
        bestGroup: 'N/A',
        worstGroup: 'N/A',
        totalSessions: 0,
    });
    const [detailedAttendance, setDetailedAttendance] = useState([]);

    useEffect(() => {
        fetchReports();
    }, [period]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const [revenue, attendance, detailed] = await Promise.all([
                getRevenueData(period),
                getAttendanceStats(period),
                getDetailedAttendance()
            ]);

            setRevenueData(Array.isArray(revenue) ? revenue : []);
            setAttendanceStats(attendance || {});
            setDetailedAttendance(Array.isArray(detailed) ? detailed : []);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map(d => d.value)) : 100;

    return (
        <DashboardLayout>
            <div className="management-header">
                <div>
                    <h1>Reports & Analytics</h1>
                    <p>Track performance and system metrics</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        className="form-select"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-light)' }}
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                    <Button variant="ghost" icon={<Download size={18} />}>
                        Export PDF
                    </Button>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>Loading reports...</div>
            ) : (
                <>
                    <div className="stats-grid">
                        <Card className="stat-card">
                            <div className="stat-content">
                                <div className="stat-icon stat-icon-primary">
                                    <Users size={24} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-title">New Registrations</p>
                                    <h2 className="stat-value">{attendanceStats.newRegistrations || 0}</h2>
                                    <p className="stat-change positive">vs last {period}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="stat-card">
                            <div className="stat-content">
                                <div className="stat-icon stat-icon-success">
                                    <DollarSign size={24} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-title">Total Revenue</p>
                                    <h2 className="stat-value">${(attendanceStats.totalRevenue || 0).toLocaleString()}</h2>
                                    <p className="stat-change positive">vs last {period}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="stat-card">
                            <div className="stat-content">
                                <div className="stat-icon stat-icon-warning">
                                    <Calendar size={24} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-title">Session Attendance</p>
                                    <h2 className="stat-value">{attendanceStats.average || '0%'}</h2>
                                    <p className="stat-change negative">vs last {period}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="dashboard-grid">
                        <Card title="Revenue Growth" className="management-card">
                            <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '20px 0' }}>
                                {revenueData.length > 0 ? (
                                    revenueData.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                            <div
                                                className="chart-bar"
                                                style={{
                                                    height: `${(item.value / maxRevenue) * 200}px`,
                                                    width: '40px',
                                                    backgroundColor: 'var(--primary)',
                                                    borderRadius: '6px 6px 0 0',
                                                    marginBottom: '10px',
                                                    transition: 'height 0.3s ease'
                                                }}
                                            ></div>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-secondary)' }}>No revenue data available.</div>
                                )}
                            </div>
                        </Card>

                        <Card title="Attendance Insights" className="management-card">
                            <div className="activity-list">
                                <div className="activity-item" style={{ padding: '15px', borderBottom: '1px solid var(--border-light)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Average Attendance</span>
                                        <span style={{ fontWeight: 600 }}>{attendanceStats.average}</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }}>
                                        <div style={{ width: attendanceStats.average, height: '100%', backgroundColor: 'var(--success)', borderRadius: '4px' }}></div>
                                    </div>
                                </div>

                                <div className="activity-item" style={{ padding: '15px', borderBottom: '1px solid var(--border-light)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Best Performing Group</span>
                                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{attendanceStats.bestGroup}</span>
                                    </div>
                                </div>

                                <div className="activity-item" style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Needs Attention</span>
                                        <span style={{ fontWeight: 600, color: 'var(--error)' }}>{attendanceStats.worstGroup}</span>
                                    </div>
                                </div>

                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    <Button variant="outline" fullWidth onClick={() => setShowDetailedAttendance(true)}>
                                        View Detailed Attendance Report
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Detailed Attendance Modal */}
                    <Modal
                        isOpen={showDetailedAttendance}
                        onClose={() => setShowDetailedAttendance(false)}
                        title="Detailed Attendance Report"
                        size="lg"
                    >
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Group Name</th>
                                        <th>Total Sessions</th>
                                        <th>Avg. Attendance</th>
                                        <th>Last Session</th>
                                        <th>Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detailedAttendance.length > 0 ? (
                                        detailedAttendance.map((group, index) => (
                                            <tr key={index}>
                                                <td style={{ fontWeight: 500 }}>{group.group}</td>
                                                <td>{group.sessions}</td>
                                                <td>
                                                    <span className={`status-badge status-${parseInt(group.attendance) >= 85 ? 'success' : parseInt(group.attendance) >= 75 ? 'warning' : 'error'}`}>
                                                        {group.attendance}
                                                    </span>
                                                </td>
                                                <td>{group.lastSession}</td>
                                                <td>
                                                    <TrendingUp size={16} color={parseInt(group.attendance) >= 80 ? 'var(--success)' : 'var(--text-secondary)'} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="empty-state">No detailed records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Modal>
                </>
            )}
        </DashboardLayout>
    );
};

export default ReportsManagement;
