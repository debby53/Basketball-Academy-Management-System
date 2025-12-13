import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import { getCurrentUser } from '../../services/authService';
import { getParentChildren } from '../../services/parentService';
import { getPaymentsByPlayer } from '../../services/paymentService';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';

const ParentPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const user = getCurrentUser();

                // 1. Get Children
                const children = await getParentChildren(user?.id).catch(() => []);
                const childrenList = Array.isArray(children) ? children : children.data || [];

                if (childrenList.length === 0) {
                    setPayments([]);
                    setLoading(false);
                    return;
                }

                // 2. Get Payments for each child
                const paymentPromises = childrenList.map(child =>
                    getPaymentsByPlayer(child.id)
                        .then(res => {
                            const pList = Array.isArray(res) ? res : res.data || [];
                            // Add child name to payment for display
                            return pList.map(p => ({ ...p, childName: child.name }));
                        })
                        .catch(() => [])
                );

                const results = await Promise.all(paymentPromises);
                const allPayments = results.flat().sort((a, b) => new Date(b.date) - new Date(a.date));

                setPayments(allPayments);

            } catch (error) {
                console.error('Failed to fetch payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'success';
            case 'Pending': return 'warning';
            case 'Overdue': return 'error';
            default: return 'default';
        }
    };

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>Payment History</h1>
                    <p className="dashboard-subtitle">Track payments requests and history</p>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Loading payments...</div>
            ) : (
                <div className="layout-grid">
                    {/* Summary Cards */}
                    <div className="stats-container" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <Card className="stat-card" style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ padding: '10px', background: '#e8f5e9', borderRadius: '50%', color: '#2e7d32' }}>
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Paid</p>
                                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                                        ${payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
                                    </h2>
                                </div>
                            </div>
                        </Card>
                        <Card className="stat-card" style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ padding: '10px', background: '#fff3e0', borderRadius: '50%', color: '#ef6c00' }}>
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending</p>
                                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                                        ${payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
                                    </h2>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card>
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Child</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Invoice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length > 0 ? (
                                        payments.map((payment, index) => (
                                            <tr key={payment.id || index}>
                                                <td>{payment.description}</td>
                                                <td>{payment.childName || 'Child'}</td>
                                                <td>{payment.date}</td>
                                                <td style={{ fontWeight: 600 }}>${Number(payment.amount).toLocaleString()}</td>
                                                <td>
                                                    <span className={`status-badge status-${getStatusColor(payment.status)}`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn-link">Download</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="empty-state">No payment records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ParentPayments;
