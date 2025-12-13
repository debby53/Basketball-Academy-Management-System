import { useState, useEffect } from 'react';
import { Users, UserPlus, Edit2, Trash2, Search, Mail, Phone } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import { getAllParents, createParent, updateParent, deleteParent } from '../../services/parentService';
import './Management.css';

const ParentsManagement = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParent, setSelectedParent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form and Alert State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        children: '', // Comma separated string for simplicity in UI, backend might expect array
        address: '', // Added address as it might be relevant
        status: 'Active'
    });
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

    useEffect(() => {
        fetchParents();
    }, []);

    const fetchParents = async () => {
        try {
            setLoading(true);
            const data = await getAllParents();
            setParents(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Failed to fetch parents:', error);
            showAlert('error', 'Failed to load parents.');
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && selectedParent) {
                const updatedParent = await updateParent(selectedParent.id, formData);
                setParents(parents.map(p => p.id === selectedParent.id ? updatedParent : p));
                showAlert('success', 'Parent updated successfully!');
            } else {
                const newParent = await createParent(formData);
                setParents([...parents, newParent]);
                showAlert('success', 'Parent added successfully!');
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error('Operation failed:', error);
            showAlert('error', isEditing ? 'Failed to update parent.' : 'Failed to add parent.');
        }
    };

    const handleDelete = async (parentId) => {
        if (!window.confirm('Are you sure you want to delete this parent? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteParent(parentId);
            setParents(parents.filter(p => p.id !== parentId));
            showAlert('success', 'Parent deleted successfully!');
        } catch (error) {
            console.error('Delete failed:', error);
            showAlert('error', 'Failed to delete parent.');
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (parent) => {
        setSelectedParent(parent);
        setFormData({
            firstName: parent.firstName,
            lastName: parent.lastName,
            email: parent.email,
            phone: parent.phone,
            children: parent.children || '', // potential array handling if needed
            address: parent.address || '',
            status: parent.status
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            children: '',
            address: '',
            status: 'Active'
        });
        setSelectedParent(null);
        setIsEditing(false);
    };

    const filteredParents = parents.filter(parent =>
        `${parent.firstName} ${parent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (parent.children && parent.children.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <DashboardLayout>
            <div className="dashboard-header">
                <div>
                    <h1>Parents Management</h1>
                    <p className="dashboard-subtitle">Manage registered parents and guardians</p>
                </div>
                <Button
                    variant="primary"
                    icon={<UserPlus size={20} />}
                    onClick={openAddModal}
                >
                    Add Parent
                </Button>
            </div>

            {alert.show && (
                <div style={{ marginBottom: '1rem' }}>
                    <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
                </div>
            )}

            <div className="search-filter-bar">
                <div className="search-input">
                    <Input
                        type="text"
                        placeholder="Search by name, email, or children..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={<Search size={18} />}
                    />
                </div>
            </div>

            <Card>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading parents...</div>
                ) : filteredParents.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👨‍👩‍👧‍👦</div>
                        <p>No parents found. {searchTerm ? 'Try adjusting your search.' : 'Add your first parent to get started.'}</p>
                    </div>
                ) : (
                    <div className="management-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Children</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParents.map((parent) => (
                                    <tr key={parent.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar-small">
                                                    {parent.firstName[0]}{parent.lastName[0]}
                                                </div>
                                                <span>{parent.firstName} {parent.lastName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contact-info">
                                                <div className="contact-item">
                                                    <Mail size={14} />
                                                    <span>{parent.email}</span>
                                                </div>
                                                <div className="contact-item">
                                                    <Phone size={14} />
                                                    <span>{parent.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{parent.children}</td>
                                        <td>
                                            <span className={`status-badge status-badge-${parent.status.toLowerCase()}`}>
                                                {parent.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<Edit2 size={16} />}
                                                    onClick={() => openEditModal(parent)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    icon={<Trash2 size={16} />}
                                                    onClick={() => handleDelete(parent.id)}
                                                >
                                                    Delete
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

            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    resetForm();
                }}
                title={isEditing ? "Edit Parent" : "Add New Parent"}
                size="lg"
            >
                <form onSubmit={handleSubmit}>
                    <div className="modal-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {!isEditing && (
                            <Alert type="info" message="Add a new parent regarding their children." />
                        )}

                        <div className="form-grid">
                            <Input
                                label="First Name"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Last Name"
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-grid">
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <Input
                            label="Address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Full Address"
                        />

                        <Input
                            label="Children"
                            name="children"
                            type="text"
                            value={formData.children}
                            onChange={handleInputChange}
                            placeholder="Enter children names separated by comma"
                            required
                        />

                        <div className="modal-actions">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                {isEditing ? 'Update Parent' : 'Add Parent'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
};

export default ParentsManagement;
