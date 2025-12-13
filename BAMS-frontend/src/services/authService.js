import apiClient from './apiClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

/**
 * Login user
 */
export const login = async (email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email,
        password
    });

    const { accessToken, refreshToken, user } = response.data;

    // Store tokens and user info
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));

    return { user, accessToken, refreshToken };
};

/**
 * Register new user
 */
export const register = async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);

    const { accessToken, refreshToken, user } = response.data;

    // Store tokens and user info
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));

    return { user, accessToken, refreshToken };
};

/**
 * Logout user
 */
export const logout = async () => {
    try {
        await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Clear local storage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    }
};

/**
 * Refresh access token
 */
export const refreshToken = async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await apiClient.post(API_ENDPOINTS.REFRESH, {
        refreshToken
    });

    const { accessToken } = response.data;

    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

    return accessToken;
};

/**
 * Request password reset
 */
export const forgotPassword = async (email) => {
    const response = await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, {
        email
    });

    return response.data;
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
    const response = await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        newPassword
    });

    return response.data;
};

/**
 * Get current user from local storage
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);

    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (error) {
        console.error('Error parsing user info:', error);
        return null;
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
};
