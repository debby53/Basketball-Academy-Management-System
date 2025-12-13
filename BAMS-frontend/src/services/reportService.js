import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const getRevenueData = async (period = 'month') => {
    const response = await apiClient.get(API_ENDPOINTS.REVENUE_DATA, { params: { period } });
    return response.data;
};

export const getAttendanceStats = async (period = 'month') => {
    const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE_STATS, { params: { period } });
    return response.data;
};

export const getDetailedAttendance = async () => {
    // Assuming reusing attendance stats endpoint or a specific one if needed
    const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE_STATS, { params: { detailed: true } });
    return response.data;
};
