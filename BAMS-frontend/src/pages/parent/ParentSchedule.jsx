import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { getSchedule } from '../../services/scheduleService';

const ParentSchedule = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data = await getSchedule();
                setEvents(Array.isArray(data) ? data : data.data || []);
            } catch (error) {
                console.error('Failed to fetch schedule:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>Team Schedule</h1>
                    <p className="dashboard-subtitle">Upcoming games and training sessions</p>
                </div>
            </div>

            <div className="events-grid">
                {loading ? (
                    <Card><div style={{ padding: '2rem', textAlign: 'center' }}>Loading schedule...</div></Card>
                ) : events.length > 0 ? (
                    events.map(event => (
                        <Card key={event.id} className="event-card">
                            <div className="event-header">
                                <span className={`event-type type-${event.type?.toLowerCase() || 'default'}`}>{event.type}</span>
                            </div>
                            <h3 className="event-title">{event.title}</h3>
                            <div className="event-details">
                                <div className="detail-item">
                                    <Calendar size={16} />
                                    <span>{event.date}</span>
                                </div>
                                <div className="detail-item">
                                    <Clock size={16} />
                                    <span>{event.time}</span>
                                </div>
                                <div className="detail-item">
                                    <MapPin size={16} />
                                    <span>{event.location}</span>
                                </div>
                            </div>
                            {event.description && <p className="event-description">{event.description}</p>}
                        </Card>
                    ))
                ) : (
                    <Card><div style={{ padding: '2rem', textAlign: 'center' }}>No upcoming events scheduled.</div></Card>
                )}
            </div>

            <style>{`
                .events-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }
                .event-card {
                    padding: 20px;
                    border-left: 4px solid var(--primary-color);
                }
                .event-header {
                    margin-bottom: 10px;
                }
                .event-type {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    font-weight: 600;
                    padding: 4px 8px;
                    border-radius: 4px;
                    background: var(--bg-hover);
                }
                .type-match { background: #ffebee; color: #d32f2f; }
                .type-training { background: #e3f2fd; color: #1976d2; }
                .event-title { margin-bottom: 15px; font-size: 1.2rem; }
                .event-details { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
                .detail-item { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: 0.9rem; }
                .event-description { font-size: 0.9rem; color: var(--text-secondary); border-top: 1px solid var(--border-light); padding-top: 10px; }
            `}</style>
        </DashboardLayout>
    );
};

export default ParentSchedule;
