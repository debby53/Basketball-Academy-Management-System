import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import { Send, Users, History, MessageSquare, Plus, Clock } from 'lucide-react';
import { getAllMessages, sendMessage } from '../../services/communicationService';
import './Management.css';

const CommunicationManagement = () => {
    const [activeTab, setActiveTab] = useState('compose');
    const [recipientType, setRecipientType] = useState('all');
    const [messageSubject, setMessageSubject] = useState('');
    const [messageBody, setMessageBody] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchMessages();
        }
    }, [activeTab]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await getAllMessages();
            setMessages(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            setNotification({ type: 'error', message: 'Failed to load message history.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await sendMessage({
                subject: messageSubject,
                body: messageBody,
                recipientType,
                date: new Date().toISOString()
            });

            setNotification({ type: 'success', message: 'Announcement sent successfully!' });
            setMessageSubject('');
            setMessageBody('');
            setActiveTab('history'); // Switch to history to see the new message
        } catch (error) {
            console.error('Failed to send message:', error);
            setNotification({ type: 'error', message: 'Failed to send announcement.' });
        } finally {
            setLoading(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <DashboardLayout>
            <div className="management-header">
                <div>
                    <h1>Communications</h1>
                    <p>Send messages and announcements to users</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        variant={activeTab === 'compose' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('compose')}
                        icon={<Plus size={18} />}
                    >
                        Compose
                    </Button>
                    <Button
                        variant={activeTab === 'history' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('history')}
                        icon={<History size={18} />}
                    >
                        History
                    </Button>
                </div>
            </div>

            {notification && (
                <div style={{ marginBottom: '20px' }}>
                    <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
                </div>
            )}

            {activeTab === 'compose' ? (
                <div className="dashboard-grid">
                    <Card className="management-card" title="New Message">
                        <form onSubmit={handleSend} className="form-layout" style={{ maxWidth: '800px', padding: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Recipients</label>
                                <div className="select-wrapper">
                                    <select
                                        className="form-select"
                                        value={recipientType}
                                        onChange={(e) => setRecipientType(e.target.value)}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                                    >
                                        <option value="all">All Users</option>
                                        <option value="parents">All Parents</option>
                                        <option value="coaches">All Coaches</option>
                                        <option value="players">All Players</option>
                                    </select>
                                </div>
                            </div>

                            <Input
                                label="Subject"
                                placeholder="Enter message subject"
                                value={messageSubject}
                                onChange={(e) => setMessageSubject(e.target.value)}
                            />

                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    className="form-textarea"
                                    rows="10"
                                    placeholder="Type your message here..."
                                    value={messageBody}
                                    onChange={(e) => setMessageBody(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-light)',
                                        fontFamily: 'inherit',
                                        resize: 'vertical'
                                    }}
                                ></textarea>
                            </div>

                            <div className="form-actions" style={{ marginTop: '20px' }}>
                                <Button type="submit" variant="primary" size="lg" icon={<Send size={18} />} loading={loading}>
                                    Send Announcement
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card title="Quick Templates" className="stat-card">
                        <div className="activity-list">
                            {[
                                'Practice Cancelled (Weather)',
                                'Game Schedule Update',
                                'Fee Reminder',
                                'Meeting Notification'
                            ].map((template, i) => (
                                <div key={i} className="activity-item" style={{ cursor: 'pointer', padding: '10px', borderBottom: '1px solid var(--border-light)' }} onClick={() => setMessageSubject(template)}>
                                    <MessageSquare size={16} style={{ marginRight: '10px', color: 'var(--primary)' }} />
                                    <span>{template}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            ) : (
                <Card className="management-card">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading history...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Recipients</th>
                                        <th>Date Sent</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.length > 0 ? (
                                        messages.map((msg) => (
                                            <tr key={msg.id}>
                                                <td style={{ fontWeight: 500 }}>{msg.subject}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Users size={16} />
                                                        {msg.recipientType || msg.recipient || 'All'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Clock size={16} />
                                                        {new Date(msg.date).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`status-badge status-${msg.status === 'Failed' ? 'error' : 'success'}`}>
                                                        {msg.status || 'Sent'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedMessage(msg)}
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="empty-state">No message history found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            )}

            {/* Message Details Modal */}
            <Modal
                isOpen={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                title="Message Details"
            >
                {selectedMessage && (
                    <div className="message-details">
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Subject</label>
                            <h3 style={{ margin: '5px 0' }}>{selectedMessage.subject}</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Recipient</label>
                                <p style={{ margin: '5px 0' }}>{selectedMessage.recipientType || selectedMessage.recipient}</p>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date Sent</label>
                                <p style={{ margin: '5px 0' }}>{new Date(selectedMessage.date).toLocaleString()}</p>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Message Content</label>
                            <div style={{
                                marginTop: '10px',
                                padding: '15px',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: '8px',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {selectedMessage.body}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};

export default CommunicationManagement;
