import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get all schedule events
 */
export const getSchedule = async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.SCHEDULE, { params });
    return response.data;
};

/**
 * Get schedule event by ID
 */
export const getScheduleById = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.SCHEDULE_BY_ID(id));
    return response.data;
};

/**
 * Create new schedule event
 */
export const createSchedule = async (scheduleData) => {
    const response = await apiClient.post(API_ENDPOINTS.SCHEDULE, scheduleData);
    return response.data;
};

/**
 * Update schedule event
 */
export const updateSchedule = async (id, scheduleData) => {
    const response = await apiClient.put(API_ENDPOINTS.SCHEDULE_BY_ID(id), scheduleData);
    return response.data;
};

/**
 * Delete schedule event
 */
export const deleteSchedule = async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.SCHEDULE_BY_ID(id));
    return response.data;
};
