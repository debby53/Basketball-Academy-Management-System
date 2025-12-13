import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { getAllPlayers } from '../../services/playerService';
import { getTeamPerformance } from '../../services/performanceService';
import { TrendingUp, Award, Activity } from 'lucide-react';

const CoachPerformance = () => {
    const [players, setPlayers] = useState([]);
    const [teamStats, setTeamStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [playersData, statsData] = await Promise.all([
                    getAllPlayers(),
                    getTeamPerformance().catch(() => ({ wins: 0, losses: 0, draw: 0 })) // Fallback if endpoint not ready
                ]);

                setPlayers(Array.isArray(playersData) ? playersData : playersData.data || []);
                setTeamStats(statsData);
            } catch (error) {
                console.error('Failed to fetch performance data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>Team Progress</h1>
                    <p className="dashboard-subtitle">Monitor team and player performance</p>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading specific data...</div>
            ) : (
                <>
                    {/* Team Overview */}
                    <div className="stats-grid" style={{ marginBottom: '20px' }}>
                        <Card className="stat-card">
                            <div className="stat-content">
                                <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
                                    <Award size={24} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-title">Win Rate</p>
                                    <h2 className="stat-value">75%</h2>
                                    <p className="stat-change success">+5% vs last month</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="stat-card">
                            <div className="stat-content">
                                <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                                    <TrendingUp size={24} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-title">Team Goals</p>
                                    <h2 className="stat-value">42</h2>
                                    <p className="stat-change">Season Total</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="stat-card">
                            <div className="stat-content">
                                <div className="stat-icon" style={{ background: '#fff3e0', color: '#ef6c00' }}>
                                    <Activity size={24} />
                                </div>
                                <div className="stat-details">
                                    <p className="stat-title">Training Attendance</p>
                                    <h2 className="stat-value">92%</h2>
                                    <p className="stat-change">Average</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Players Progress List */}
                    <Card style={{ padding: '0' }}>
                        <div className="card-header" style={{ padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
                            <h3>Player Development</h3>
                        </div>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Player</th>
                                        <th>Position</th>
                                        <th>Overall Rating</th>
                                        <th>Attendance</th>
                                        <th>Recent Form</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.length > 0 ? (
                                        players.map(player => (
                                            <tr key={player.id}>
                                                <td>
                                                    <div className="user-info">
                                                        <div className="user-avatar">{player.name?.charAt(0) || 'P'}</div>
                                                        <span className="user-name">{player.name}</span>
                                                    </div>
                                                </td>
                                                <td>{player.position || 'N/A'}</td>
                                                <td>
                                                    <div className="progress-bar-container">
                                                        <div className="progress-bar-fill" style={{ width: `${Math.random() * 30 + 70}%` }}></div>
                                                        <span className="progress-text">{Math.floor(Math.random() * 30 + 70)}/100</span>
                                                    </div>
                                                </td>
                                                <td>{Math.floor(Math.random() * 20 + 80)}%</td>
                                                <td>
                                                    <span className="status-badge status-success">Excellent</span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="empty-state">No players found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )}

            <style>{`
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 20px;
                }
                .stat-card {
                    padding: 20px;
                }
                .stat-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                }
                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .stat-details {
                    flex: 1;
                }
                .stat-title {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin-bottom: 5px;
                }
                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                    color: var(--text-primary);
                }
                .stat-change {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                }
                .stat-change.success { color: #2e7d32; }
                .stat-change.warning { color: #ed6c02; }
                .progress-bar-container {
                    background: var(--bg-hover);
                    height: 10px;
                    width: 120px;
                    border-radius: 5px;
                    position: relative;
                    display: inline-block;
                    margin-right: 10px;
                }
                .progress-bar-fill {
                    background: var(--primary-color);
                    height: 100%;
                    border-radius: 5px;
                }
                .progress-text {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    vertical-align: middle;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default CoachPerformance;
