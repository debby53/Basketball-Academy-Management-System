import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get user notifications
 */
export const getNotifications = async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS, { params });
    return response.data;
};

/**
 * Mark notifications as read
 */
export const markAsRead = async (ids = []) => {
    const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS_MARK_READ, { ids });
    return response.data;
};
