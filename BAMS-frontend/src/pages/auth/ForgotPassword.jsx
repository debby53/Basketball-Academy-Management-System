import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../../services/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">✉️</div>
                        <h1 className="auth-title">Check Your Email</h1>
                        <p className="auth-subtitle">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                    </div>

                    <Alert
                        type="success"
                        message="Please check your email and follow the instructions to reset your password."
                    />

                    <div style={{ marginTop: 'var(--space-6)' }}>
                        <Link to="/login">
                            <Button variant="outline" fullWidth icon={<ArrowLeft size={18} />}>
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🔒</div>
                    <h1 className="auth-title">Forgot Password?</h1>
                    <p className="auth-subtitle">
                        Enter your email address and we'll send you a link to reset your password
                    </p>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={loading}
                    >
                        Send Reset Link
                    </Button>
                </form>

                <div className="auth-footer">
                    <Link to="/login" className="auth-link">
                        <ArrowLeft size={16} style={{ marginRight: 'var(--space-2)' }} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
