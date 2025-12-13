import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

// Get comprehensive dashboard stats
export const getDashboardStats = async () => {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD_STATS);
    return response.data;
};

// Get recent activity log
export const getRecentActivity = async () => {
    const response = await apiClient.get(API_ENDPOINTS.RECENT_ACTIVITY);
    return response.data;
};
