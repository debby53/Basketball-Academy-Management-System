import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get all parents
 */
export const getAllParents = async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PARENTS, { params });
    return response.data;
};

/**
 * Get parent by ID
 */
export const getParentById = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PARENT_BY_ID(id));
    return response.data;
};

/**
 * Create new parent
 */
export const createParent = async (parentData) => {
    const response = await apiClient.post(API_ENDPOINTS.PARENTS, parentData);
    return response.data;
};

/**
 * Update parent
 */
export const updateParent = async (id, parentData) => {
    const response = await apiClient.put(API_ENDPOINTS.PARENT_BY_ID(id), parentData);
    return response.data;
};

/**
 * Delete parent
 */
export const deleteParent = async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.PARENT_BY_ID(id));
    return response.data;
};

/**
 * Get parent's children
 */
export const getParentChildren = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PARENT_CHILDREN(id));
    return response.data;
};
