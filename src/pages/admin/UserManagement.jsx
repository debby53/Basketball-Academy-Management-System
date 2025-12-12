import { useState } from 'react';
import { Users, UserCheck, CheckCircle, XCircle, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import './UserManagement.css';

const UserManagement = () => {
    const [showAddAdminModal, setShowAddAdminModal] = useState(false);
    const [adminFormData, setAdminFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // Mock pending users
    const [pendingUsers] = useState([
        { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'Coach', date: '2024-12-10' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Parent', date: '2024-12-11' },
        { id: 3, name: 'Mike Davis', email: 'mike.d@example.com', role: 'Player', date: '2024-12-12' }
    ]);

    const handleApprove = (userId) => {
        alert(`✅ User approved! They will receive an email notification.`);
    };

    const handleReject = (userId) => {
        if (confirm('Are you sure you want to reject this user?')) {
            alert('❌ User rejected.');
        }
    };

    const handleAddAdmin = (e) => {
        e.preventDefault();
        alert('✅ Admin user created successfully!');
        setShowAddAdminModal(false);
        setAdminFormData({ firstName: '', lastName: '', email: '', phone: '' });
    };

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>User Management</h1>
                    <p className="dashboard-subtitle">Approve registrations and manage admin users</p>
                </div>
                <Button
                    variant="primary"
                    icon={<UserCheck size={20} />}
                    onClick={() => setShowAddAdminModal(true)}
                >
                    Add Admin User
                </Button>
            </div>

            <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
                <Card className="stat-card">
                    <div className="stat-content">
                        <div className="stat-icon stat-icon-warning">
                            <Clock size={24} />
                        </div>
                        <div className="stat-details">
                            <p className="stat-title">Pending Approvals</p>
                            <h2 className="stat-value">{pendingUsers.length}</h2>
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="Pending User Approvals">
                {pendingUsers.length === 0 ? (
                    <Alert type="info" message="No pending user approvals at this time." />
                ) : (
                    <div className="user-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Registration Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-name">
                                                <Users size={18} />
                                                <span>{user.name}</span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge role-badge-${user.role.toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.date}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    icon={<CheckCircle size={16} />}
                                                    onClick={() => handleApprove(user.id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={<XCircle size={16} />}
                                                    onClick={() => handleReject(user.id)}
                                                >
                                                    Reject
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Add Admin Modal */}
            <Modal
                isOpen={showAddAdminModal}
                onClose={() => setShowAddAdminModal(false)}
                title="Add Admin User"
                size="md"
            >
                <form onSubmit={handleAddAdmin}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <Alert type="info" message="Admin users have full system access and can manage all aspects of the platform." />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <Input
                                label="First Name"
                                type="text"
                                value={adminFormData.firstName}
                                onChange={(e) => setAdminFormData({ ...adminFormData, firstName: e.target.value })}
                                required
                            />
                            <Input
                                label="Last Name"
                                type="text"
                                value={adminFormData.lastName}
                                onChange={(e) => setAdminFormData({ ...adminFormData, lastName: e.target.value })}
                                required
                            />
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            value={adminFormData.email}
                            onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                            required
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            value={adminFormData.phone}
                            onChange={(e) => setAdminFormData({ ...adminFormData, phone: e.target.value })}
                            required
                        />

                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowAddAdminModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Create Admin User
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default UserManagement;
