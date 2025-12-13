import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { getCurrentUser } from '../../services/authService';
import { getPlayerPerformance } from '../../services/performanceService';
import { TrendingUp, Target, BarChart2 } from 'lucide-react';

const PlayerProgress = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = getCurrentUser();
                if (user?.id) {
                    const data = await getPlayerPerformance(user.id).catch(() => null);
                    // Mock data if null for demonstration
                    setStats(data || {
                        matches: 12,
                        goals: 5,
                        assists: 3,
                        rating: 7.8,
                        attendance: 92
                    });
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>My Progress</h1>
                    <p className="dashboard-subtitle">Track your performance and growth</p>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading stats...</div>
            ) : (
                <div className="stats-container">
                    {/* Key Metrics */}
                    <div className="metrics-grid">
                        <Card className="metric-card">
                            <div className="metric-icon"><Target size={24} /></div>
                            <h3>Matches</h3>
                            <div className="metric-value">{stats?.matches || 0}</div>
                        </Card>
                        <Card className="metric-card">
                            <div className="metric-icon"><TrendingUp size={24} /></div>
                            <h3>Rating</h3>
                            <div className="metric-value">{stats?.rating || 0}</div>
                        </Card>
                        <Card className="metric-card">
                            <div className="metric-icon"><BarChart2 size={24} /></div>
                            <h3>Goals</h3>
                            <div className="metric-value">{stats?.goals || 0}</div>
                        </Card>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repear(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        <Card title="Performance History">
                            <div className="chart-placeholder">
                                <div className="bar" style={{ height: '60%' }}></div>
                                <div className="bar" style={{ height: '80%' }}></div>
                                <div className="bar" style={{ height: '40%' }}></div>
                                <div className="bar" style={{ height: '90%' }}></div>
                                <div className="bar" style={{ height: '70%' }}></div>
                            </div>
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '10px' }}>Last 5 Matches Rating</p>
                        </Card>

                        <Card title="Coach Feedback">
                            <ul className="feedback-list">
                                <li className="feedback-item">
                                    <span className="feedback-date">Oct 12</span>
                                    <p>Great positioning in the second half. Work on stamina.</p>
                                </li>
                                <li className="feedback-item">
                                    <span className="feedback-date">Oct 05</span>
                                    <p>Excellent team play and passing.</p>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            )}

            <style>{`
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 20px;
                }
                .metric-card {
                    text-align: center;
                    padding: 20px;
                }
                .metric-icon {
                    color: var(--primary-color);
                    margin-bottom: 10px;
                }
                .metric-value {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .chart-placeholder {
                    height: 150px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-around;
                    padding: 10px;
                    background: var(--bg-hover);
                    border-radius: 8px;
                }
                .bar {
                    width: 30px;
                    background: var(--primary-color);
                    border-radius: 4px 4px 0 0;
                    opacity: 0.8;
                }
                .feedback-list {
                    list-style: none;
                    padding: 0;
                }
                .feedback-item {
                    border-bottom: 1px solid var(--border-light);
                    padding: 10px 0;
                }
                .feedback-item:last-child { border-bottom: none; }
                .feedback-date {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default PlayerProgress;
