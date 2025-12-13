import { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, Edit, Trash, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import { getAllPlayers, createPlayer, updatePlayer, deletePlayer } from '../../services/playerService';
import './Management.css';

const PlayersManagement = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        team: '',
        guardianName: '',
        guardianPhone: '',
        status: 'Active'
    });

    // Alert State
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            const data = await getAllPlayers();
            // Handle if data is array or object with data property
            setPlayers(Array.isArray(data) ? data : data.data || []);
        } catch (error) {
            console.error('Failed to fetch players:', error);
            showAlert('error', 'Failed to load players. Please try again.');
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
            age: '',
            team: '',
            guardianName: '',
            guardianPhone: '',
            status: 'Active'
        });
        setIsEditing(false);
        setSelectedPlayer(null);
    };

    const openEditModal = (player) => {
        setFormData({
            firstName: player.firstName,
            lastName: player.lastName,
            email: player.email,
            age: player.age,
            team: player.team,
            guardianName: player.guardianName,
            guardianPhone: player.guardianPhone,
            status: player.status
        });
        setSelectedPlayer(player);
        setIsEditing(true);
        setShowAddModal(true);
    };

    const openDeleteModal = (player) => {
        setSelectedPlayer(player);
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
                const updatedPlayer = await updatePlayer(selectedPlayer.id, formData);
                setPlayers(players.map(p => p.id === selectedPlayer.id ? updatedPlayer : p));
                showAlert('success', 'Player updated successfully!');
            } else {
                const newPlayer = await createPlayer(formData);
                setPlayers([...players, newPlayer]);
                showAlert('success', 'Player added successfully!');
            }
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            console.error('Operation failed:', error);
            showAlert('error', isEditing ? 'Failed to update player.' : 'Failed to add player.');
        }
    };

    const handleDelete = async () => {
        if (!selectedPlayer) return;

        try {
            await deletePlayer(selectedPlayer.id);
            setPlayers(players.filter(p => p.id !== selectedPlayer.id));
            showAlert('success', 'Player deleted successfully!');
            setShowDeleteModal(false);
            setSelectedPlayer(null);
        } catch (error) {
            console.error('Delete failed:', error);
            showAlert('error', 'Failed to delete player.');
        }
    };

    const filteredPlayers = players.filter(player => {
        const matchesSearch = player.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || player.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout>
            <div className="management-header">
                <div>
                    <h1>Players Management</h1>
                    <p>Manage player registrations and profiles</p>
                </div>
                <Button variant="primary" icon={<Plus size={18} />} onClick={() => setShowAddModal(true)}>
                    Add New Player
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
                            placeholder="Search players..."
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
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
            </div>

            <Card>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}>Loading players...</div>
                ) : (
                    <div className="management-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age/Team</th>
                                    <th>Contact</th>
                                    <th>Guardian</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPlayers.length > 0 ? (
                                    filteredPlayers.map((player) => (
                                        <tr key={player.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">
                                                        {player.firstName[0]}{player.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="user-name">{player.firstName} {player.lastName}</div>
                                                        <div className="user-email">{player.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="meta-cell">
                                                    <span>{player.age} Years</span>
                                                    <span className="meta-tag">{player.team}</span>
                                                </div>
                                            </td>
                                            <td>{player.guardianPhone}</td>
                                            <td>{player.guardianName}</td>
                                            <td>
                                                <span className={`status-badge ${player.status.toLowerCase()}`}>
                                                    {player.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="action-btn edit" onClick={() => openEditModal(player)}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="action-btn delete" onClick={() => openDeleteModal(player)}>
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="empty-state">
                                            No players found matching your criteria.
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
                title={isEditing ? "Edit Player" : "Add New Player"}
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
                            label="Age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            required
                            min="5"
                            max="25"
                        />
                    </div>

                    <Input
                        label="Team"
                        type="text"
                        value={formData.team}
                        onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                        required
                    />

                    <div className="form-grid">
                        <Input
                            label="Guardian Name"
                            type="text"
                            value={formData.guardianName}
                            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                            required
                        />
                        <Input
                            label="Guardian Phone"
                            type="tel"
                            value={formData.guardianPhone}
                            onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                            required
                        />
                    </div>

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
                            Update Player
                        </Button>
                    </div>

                </form >
            </Modal>
        </DashboardLayout>
    );
};

export default PlayersManagement;
