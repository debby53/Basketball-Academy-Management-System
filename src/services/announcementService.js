import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get all announcements
 */
export const getAllAnnouncements = async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ANNOUNCEMENTS, { params });
    return response.data;
};

/**
 * Get announcement by ID
 */
export const getAnnouncementById = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ANNOUNCEMENT_BY_ID(id));
    return response.data;
};

/**
 * Create announcement
 */
export const createAnnouncement = async (announcementData) => {
    const response = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS, announcementData);
    return response.data;
};

/**
 * Update announcement
 */
export const updateAnnouncement = async (id, announcementData) => {
    const response = await apiClient.put(API_ENDPOINTS.ANNOUNCEMENT_BY_ID(id), announcementData);
    return response.data;
};

/**
 * Delete announcement
 */
export const deleteAnnouncement = async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.ANNOUNCEMENT_BY_ID(id));
    return response.data;
};
