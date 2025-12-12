import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get all payments
 */
export const getAllPayments = async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENTS, { params });
    return response.data;
};

/**
 * Get payments by player ID
 */
export const getPaymentsByPlayer = async (playerId) => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT_BY_PLAYER(playerId));
    return response.data;
};

/**
 * Create payment
 */
export const createPayment = async (paymentData) => {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS, paymentData);
    return response.data;
};

/**
 * Update payment
 */
export const updatePayment = async (id, paymentData) => {
    const response = await apiClient.put(API_ENDPOINTS.PAYMENT_BY_ID(id), paymentData);
    return response.data;
};
