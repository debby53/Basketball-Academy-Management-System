import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get team performance stats
 */
export const getTeamPerformance = async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PERFORMANCE_TEAM, { params });
    return response.data;
};

/**
 * Get player performance stats
 */
export const getPlayerPerformance = async (playerId, params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PERFORMANCE_PLAYER(playerId), { params });
    return response.data;
};

/**
 * Log performance record
 */
export const logPerformance = async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.PERFORMANCE, data);
    return response.data;
};
