import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && user) {
        const hasRequiredRole = allowedRoles.includes(user.role);

        if (!hasRequiredRole) {
            // Redirect to appropriate dashboard based on user's role
            const roleRoutes = {
                Admin: '/admin',
                Coach: '/coach',
                Parent: '/parent',
                Player: '/player'
            };

            return <Navigate to={roleRoutes[user.role] || '/'} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
