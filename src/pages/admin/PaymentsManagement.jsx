import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import { Search, Filter, Plus, DollarSign, Download, MoreVertical } from 'lucide-react';
import { getAllPayments, createPayment } from '../../services/paymentService';
import './Management.css';

const PaymentsManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);

    // New Payment Form State
    const [newPayment, setNewPayment] = useState({
        player: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        method: 'Credit Card',
        description: ''
    });

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await getAllPayments();
            setPayments(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            setNotification({ type: 'error', message: 'Failed to load payments.' });
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.player?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || payment.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'success';
            case 'Pending': return 'warning';
            case 'Overdue': return 'error';
            default: return 'default';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPayment(prev => ({ ...prev, [name]: value }));
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payment = await createPayment({
                ...newPayment,
                amount: parseFloat(newPayment.amount),
                status: 'Paid' // Default to paid implementation usually implies immediate record
            });

            setPayments([payment, ...payments]);
            setIsModalOpen(false);
            setNotification({ type: 'success', message: 'Payment recorded successfully' });

            // Reset form
            setNewPayment({
                player: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                method: 'Credit Card',
                description: ''
            });
        } catch (error) {
            console.error('Failed to record payment:', error);
            setNotification({ type: 'error', message: 'Failed to record payment.' });
        } finally {
            setLoading(false);
            // Clear notification after 3s
            setTimeout(() => setNotification(null), 3000);
        }
    };

    // Calculate stats dynamic based on fetched payments
    const totalRevenue = payments
        .filter(p => p.status === 'Paid')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingAmount = payments
        .filter(p => p.status === 'Pending')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingCount = payments.filter(p => p.status === 'Pending').length;

    const overdueAmount = payments
        .filter(p => p.status === 'Overdue')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const overdueCount = payments.filter(p => p.status === 'Overdue').length;

    return (
        <DashboardLayout>
            <div className="management-header">
                <div>
                    <h1>Payments Management</h1>
                    <p>Track and record player payments</p>
                </div>
                <Button
                    variant="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Record Payment
                </Button>
            </div>

            {notification && (
                <div style={{ marginBottom: '20px' }}>
                    <Alert type={notification.type} message={notification.message} onClose={() => setNotification(null)} />
                </div>
            )}

            {/* Stats Overview */}
            <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon stat-icon-success">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-details">
                            <p className="stat-title">Total Revenue</p>
                            <h2 className="stat-value">${totalRevenue.toLocaleString()}</h2>
                        </div>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon stat-icon-warning">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-details">
                            <p className="stat-title">Pending</p>
                            <h2 className="stat-value">${pendingAmount.toLocaleString()}</h2>
                            <p className="stat-change">{pendingCount} payments</p>
                        </div>
                    </div>
                </Card>
                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon stat-icon-error">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-details">
                            <p className="stat-title">Overdue</p>
                            <h2 className="stat-value">${overdueAmount.toLocaleString()}</h2>
                            <p className="stat-change negative">{overdueCount} payments</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="management-card">
                <div className="management-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <Input
                            placeholder="Search player..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-box">
                        <Filter size={18} className="filter-icon" />
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Overdue">Overdue</option>
                        </select>
                    </div>

                    <Button variant="ghost" icon={<Download size={18} />}>
                        Export
                    </Button>
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading payments...</div>
                ) : (
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td>
                                                <div className="user-info">
                                                    <div className="user-avatar">{payment.player?.charAt(0) || '?'}</div>
                                                    <span className="user-name">{payment.player || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td>{payment.description}</td>
                                            <td>{payment.date}</td>
                                            <td style={{ fontWeight: 600 }}>${Number(payment.amount).toLocaleString()}</td>
                                            <td>{payment.method}</td>
                                            <td>
                                                <span className={`status-badge status-${getStatusColor(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="action-icon-btn">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="empty-state">No payments found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Record New Payment"
            >
                <form onSubmit={handleRecordPayment} className="form-layout">
                    <Input
                        label="Player Name"
                        name="player"
                        placeholder="Enter player name"
                        value={newPayment.player}
                        onChange={handleInputChange}
                        required
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <Input
                            label="Amount ($)"
                            name="amount"
                            type="number"
                            placeholder="0.00"
                            value={newPayment.amount}
                            onChange={handleInputChange}
                            required
                        />
                        <Input
                            label="Date"
                            name="date"
                            type="date"
                            value={newPayment.date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Payment Method</label>
                        <select
                            className="form-select"
                            name="method"
                            value={newPayment.method}
                            onChange={handleInputChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                        >
                            <option value="Credit Card">Credit Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cash">Cash</option>
                            <option value="Check">Check</option>
                        </select>
                    </div>

                    <Input
                        label="Description"
                        name="description"
                        placeholder="e.g. Annual Membership"
                        value={newPayment.description}
                        onChange={handleInputChange}
                        required
                    />

                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" loading={loading}>
                            Record Payment
                        </Button>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default PaymentsManagement;
