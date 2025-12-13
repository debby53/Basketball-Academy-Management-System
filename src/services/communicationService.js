import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const getAllMessages = async () => {
    const response = await apiClient.get(API_ENDPOINTS.ANNOUNCEMENTS);
    return response.data;
};

export const sendMessage = async (messageData) => {
    const response = await apiClient.post(API_ENDPOINTS.ANNOUNCEMENTS, messageData);
    return response.data;
};

export const getMessageById = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ANNOUNCEMENT_BY_ID(id));
    return response.data;
};
