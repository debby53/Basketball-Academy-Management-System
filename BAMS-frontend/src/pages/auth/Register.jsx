import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, UserCheck, Users, Trophy } from 'lucide-react';
import { register as registerService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, STORAGE_KEYS } from '../../utils/constants';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '' // Coach, Parent, or Player
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const availableRoles = [
        {
            value: ROLES.COACH,
            label: 'Coach',
            icon: <Trophy size={20} />,
            description: 'Manage teams and track performance'
        },
        {
            value: ROLES.PARENT,
            label: 'Parent',
            icon: <Users size={20} />,
            description: 'Track your children\'s progress'
        },
        {
            value: ROLES.PLAYER,
            label: 'Player',
            icon: <User size={20} />,
            description: 'View your performance and schedule'
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleRoleSelect = (role) => {
        setFormData({
            ...formData,
            role: role
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.role) {
            setError('Please select a role');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            // Call register service
            const payload = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role,
                phone: formData.phone
            };

            await registerService(payload);

            // Clear any tokens stored by register (we don't auto-login before admin approval)
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_INFO);

            // Show success and redirect to login
            alert('✅ Registration Successful!\n\nYour account has been created and is pending admin approval. You will be notified once approved.');
            navigate('/login');
        } catch (err) {
            // apiClient rejects with an object that may contain message
            const msg = err?.message || err?.data?.message || String(err) || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <div className="auth-header">
                    <div className="auth-logo">⚽</div>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join our sports management platform</p>
                </div>

                {error && (
                    <Alert type="error" message={error} onClose={() => setError('')} />
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <Input
                            label="First Name"
                            type="text"
                            name="firstName"
                            placeholder="John"
                            icon={<User size={18} />}
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Last Name"
                            type="text"
                            name="lastName"
                            placeholder="Doe"
                            icon={<User size={18} />}
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="john.doe@example.com"
                        icon={<Mail size={18} />}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        name="phone"
                        placeholder="(555) 123-4567"
                        icon={<Phone size={18} />}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    {/* Role Selection */}
                    <div className="input-wrapper">
                        <label className="input-label">
                            Select Role <span className="input-required">*</span>
                        </label>
                        <div className="role-selection-grid">
                            {availableRoles.map((role) => (
                                <div
                                    key={role.value}
                                    className={`role-selection-card ${formData.role === role.value ? 'role-selection-card-active' : ''}`}
                                    onClick={() => handleRoleSelect(role.value)}
                                >
                                    <div className="role-selection-icon">{role.icon}</div>
                                    <div className="role-selection-label">{role.label}</div>
                                    <div className="role-selection-description">{role.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="At least 8 characters"
                        icon={<Lock size={18} />}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        icon={<Lock size={18} />}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <Alert
                        type="info"
                        message="Your account will be pending admin approval after registration. You'll be notified once approved."
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                    >
                        Create Account
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
