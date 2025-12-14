import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get all coaches
 */
export const getAllCoaches = async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.COACHES, { params });
    return response.data;
};

/**
 * Get coach by ID
 */
export const getCoachById = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.COACH_BY_ID(id));
    return response.data;
};

/**
 * Create new coach
 */
export const createCoach = async (coachData) => {
    const response = await apiClient.post(API_ENDPOINTS.COACHES, coachData);
    return response.data;
};

/**
 * Update coach
 */
export const updateCoach = async (id, coachData) => {
    const response = await apiClient.put(API_ENDPOINTS.COACH_BY_ID(id), coachData);
    return response.data;
};

/**
 * Delete coach
 */
export const deleteCoach = async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.COACH_BY_ID(id));
    return response.data;
};
