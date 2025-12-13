import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Trash } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import { getAllCoaches, createCoach, updateCoach, deleteCoach } from '../../services/coachService';
import './Management.css';

const CoachesManagement = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        certification: '',
        status: 'Active'
    });

    // Alert State
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

    useEffect(() => {
        fetchCoaches();
    }, []);

    const fetchCoaches = async () => {
        try {
            setLoading(true);
            const data = await getAllCoaches();
            setCoaches(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Failed to fetch coaches:', error);
            showAlert('error', 'Failed to load coaches.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resetForm = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            specialization: '',
            experience: '',
            certification: '',
            status: 'Active'
        });
        setIsEditing(false);
        setSelectedCoach(null);
    };

    const openEditModal = (coach) => {
        setFormData({
            firstName: coach.firstName,
            lastName: coach.lastName,
            email: coach.email,
            phone: coach.phone,
            specialization: coach.specialization,
            experience: coach.experience,
            certification: coach.certification,
            status: coach.status
        });
        setSelectedCoach(coach);
        setIsEditing(true);
        setShowAddModal(true);
    };

    const openDeleteModal = (coach) => {
        setSelectedCoach(coach);
        setShowDeleteModal(true);
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const updatedCoach = await updateCoach(selectedCoach.id, formData);
                setCoaches(coaches.map(c => c.id === selectedCoach.id ? updatedCoach : c));
                showAlert('success', 'Coach updated successfully!');
            } else {
                const newCoach = await createCoach(formData);
                setCoaches([...coaches, newCoach]);
                showAlert('success', 'Coach added successfully!');
            }
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            console.error('Operation failed:', error);
            showAlert('error', isEditing ? 'Failed to update coach.' : 'Failed to add coach.');
        }
    };

    const handleDelete = async () => {
        if (!selectedCoach) return;

        try {
            await deleteCoach(selectedCoach.id);
            setCoaches(coaches.filter(c => c.id !== selectedCoach.id));
            showAlert('success', 'Coach deleted successfully!');
            setShowDeleteModal(false);
            setSelectedCoach(null);
        } catch (error) {
            console.error('Delete failed:', error);
            showAlert('error', 'Failed to delete coach.');
        }
    };

    const filteredCoaches = coaches.filter(coach => {
        const matchesSearch = coach.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coach.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coach.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || coach.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout>
            <div className="management-header">
                <div>
                    <h1>Coaches Management</h1>
                    <p>Manage coaching staff and assignments</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
                    Add New Coach
                </Button>
            </div>

            {alert.show && (
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ ...alert, show: false })} />
            )}

            <div className="search-filter-bar">
                <div className="search-input">
                    <div className="search-box">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search coaches..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </div>
                </div>
                <div className="filter-box">
                    <Filter size={20} className="filter-icon" />
                    <select
                        value={filterStatus}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                    </select>
                </div>
            </div>

            <Card>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading coaches...</div>
                ) : (
                    <div className="management-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Specialization</th>
                                    <th>Contact</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCoaches.length > 0 ? (
                                    filteredCoaches.map((coach) => (
                                        <tr key={coach.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">
                                                        {coach.firstName[0]}{coach.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="user-name">{coach.firstName} {coach.lastName}</div>
                                                        <div className="user-email">{coach.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="meta-cell">
                                                    <span>{coach.specialization}</span>
                                                    <span className="meta-tag">{coach.experience} Exp</span>
                                                </div>
                                            </td>
                                            <td>{coach.phone}</td>
                                            <td>
                                                <span className={`status-badge ${coach.status.toLowerCase().replace(' ', '-')}`}>
                                                    {coach.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn edit" onClick={() => openEditModal(coach)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => openDeleteModal(coach)}>
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="empty-state">
                                            No coaches found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    resetForm();
                }}
                title={isEditing ? "Edit Coach" : "Add New Coach"}
                size="lg"
            >
                <form onSubmit={handleAdd}>


                    <div className="form-grid">
                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <Input
                        label="Specialization"
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        required
                    />

                    <div className="modal-actions">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setShowEditModal(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Update Coach
                        </Button>
                    </div>

                </form >
            </Modal>
        </DashboardLayout>
    );
};

export default CoachesManagement;
