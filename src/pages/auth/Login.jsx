import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { login as loginService } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { user, accessToken, refreshToken } = await loginService(
                formData.email,
                formData.password
            );

            login(user, { accessToken, refreshToken });

            // Redirect based on role
            const roleRoutes = {
                Admin: '/admin',
                Coach: '/coach',
                Parent: '/parent',
                Player: '/player'
            };

            navigate(roleRoutes[user.role] || '/');
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">⚽</div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to your account to continue</p>
                </div>

                {error && (
                    <Alert type="error" message={error} onClose={() => setError('')} />
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <Input
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        icon={<Mail size={18} />}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        icon={<Lock size={18} />}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="auth-forgot">
                        <Link to="/forgot-password" className="auth-link">
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                    >
                        Sign In
                    </Button>


                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
