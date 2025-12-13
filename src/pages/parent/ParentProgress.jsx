import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { getParentChildren } from '../../services/parentService';
import { getCurrentUser } from '../../services/authService';
import { Activity, Star, Calendar } from 'lucide-react';

const ParentProgress = () => {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const user = getCurrentUser();
                // Assuming we can get parent info. 
                // In a real app we might need to fetch the parent profile by user ID first if 'user.id' isn't the parent ID (e.g. if user table is separate).
                // Assuming user.id works or we have a profileId.
                if (user?.id) {
                    const data = await getParentChildren(user.id).catch(() => []);
                    setChildren(Array.isArray(data) ? data : data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch children:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchChildren();
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>Child Progress</h1>
                    <p className="dashboard-subtitle">Track your children's development</p>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : children.length > 0 ? (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {children.map(child => (
                        <Card key={child.id}>
                            <div className="child-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                <div className="user-avatar" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                                    {child.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{child.name}</h2>
                                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{child.team || 'Youth Team'}</p>
                                </div>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-box">
                                    <div className="stat-icon"><Activity size={20} /></div>
                                    <div className="stat-info">
                                        <span className="label">Attendance</span>
                                        <span className="value">95%</span>
                                    </div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-icon"><Star size={20} /></div>
                                    <div className="stat-info">
                                        <span className="label">Rating</span>
                                        <span className="value">8.5/10</span>
                                    </div>
                                </div>
                                <div className="stat-box">
                                    <div className="stat-icon"><Calendar size={20} /></div>
                                    <div className="stat-info">
                                        <span className="label">Next Game</span>
                                        <span className="value">Saturday</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                <h3>Recent Feedback</h3>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '10px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    {child.name} has shown great improvement in defensive drills this week. Keep up the good work on positioning.
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No children linked to your account found.
                    </div>
                </Card>
            )}

            <style>{`
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    padding: 15px;
                    background: var(--bg-hover);
                    border-radius: 8px;
                }
                .stat-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .stat-icon {
                    width: 36px;
                    height: 36px;
                    background: var(--bg-card);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-color);
                }
                .stat-info {
                    display: flex;
                    flex-direction: column;
                }
                .label { font-size: 0.8rem; color: var(--text-secondary); }
                .value { font-weight: 600; color: var(--text-primary); }
            `}</style>
        </DashboardLayout>
    );
};

export default ParentProgress;
