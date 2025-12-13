import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated as checkAuth, logout as logoutService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated on mount
        const initAuth = () => {
            const authenticated = checkAuth();
            setIsAuthenticated(authenticated);

            if (authenticated) {
                const currentUser = getCurrentUser();
                setUser(currentUser);
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData, tokens) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await logoutService();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
