import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import { Calendar, Plus, Trash2, Clock, MapPin } from 'lucide-react';
import { getSchedule, createSchedule, deleteSchedule } from '../../services/scheduleService';

const CoachSchedule = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        type: 'Training',
        date: '',
        time: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const data = await getSchedule();
            setEvents(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Failed to fetch schedule:', error);
            setNotification({ type: 'error', message: 'Failed to load schedule.' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handlecreateSchedule = async (e) => {
        e.preventDefault();
        try {
            const createdEvent = await createSchedule(newEvent);
            setEvents([...events, createdEvent]);
            setIsModalOpen(false);
            setNotification({ type: 'success', message: 'Event scheduled successfully' });
            setNewEvent({
                title: '',
                type: 'Training',
                date: '',
                time: '',
                location: '',
                description: ''
            });
        } catch (error) {
            console.error('Failed to create event:', error);
            setNotification({ type: 'error', message: 'Failed to schedule event.' });
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this event?')) return;

        try {
            await deleteSchedule(id);
            setEvents(events.filter(e => e.id !== id));
            setNotification({ type: 'success', message: 'Event cancelled successfully' });
        } catch (error) {
            console.error('Failed to delete event:', error);
            setNotification({ type: 'error', message: 'Failed to cancel event.' });
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>Team Schedule</h1>
                    <p className="dashboard-subtitle">Manage upcoming games and training sessions</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Event
                </Button>
            </div>

            {notification && (
                <div style={{ marginBottom: '20px' }}>
                    <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
                </div>
            )}

            <div className="events-grid">
                {loading ? (
                    <Card><div style={{ padding: '2rem', textAlign: 'center' }}>Loading schedule...</div></Card>
                ) : events.length > 0 ? (
                    events.map(event => (
                        <Card key={event.id} className="event-card">
                            <div className="event-header">
                                <span className={`event-type type-${event.type?.toLowerCase() || 'default'}`}>{event.type}</span>
                                <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)}>
                                    <Trash2 size={16} />
                                </button>
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Schedule New Event"
            >
                <form onSubmit={handlecreateSchedule} className="form-layout">
                    <Input
                        label="Event Title"
                        name="title"
                        placeholder="e.g. Training Session"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="form-group">
                        <label className="form-label">Event Type</label>
                        <select
                            className="form-select"
                            name="type"
                            value={newEvent.type}
                            onChange={handleInputChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                        >
                            <option value="Training">Training</option>
                            <option value="Match">Match</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Event">special Event</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <Input
                            label="Date"
                            name="date"
                            type="date"
                            value={newEvent.date}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Time"
                            name="time"
                            type="time"
                            value={newEvent.time}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <Input
                        label="Location"
                        name="location"
                        placeholder="e.g. Main Court"
                        value={newEvent.location}
                        onChange={handleInputChange}
                        required
                    />

                    <Input
                        label="Description"
                        name="description"
                        placeholder="Additional details..."
                        value={newEvent.description}
                        onChange={handleInputChange}
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" variant="primary">Schedule Event</Button>
                    </div>
                </form>
            </Modal>

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
                    display: flex;
                    justify-content: space-between;
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
                .delete-btn {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 4px;
                }
                .delete-btn:hover { color: #d32f2f; }
                .event-title { margin-bottom: 15px; font-size: 1.2rem; }
                .event-details { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
                .detail-item { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: 0.9rem; }
                .event-description { font-size: 0.9rem; color: var(--text-secondary); border-top: 1px solid var(--border-light); padding-top: 10px; }
            `}</style>
        </DashboardLayout>
    );
};

export default CoachSchedule;
