import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

export const getAllPayments = async () => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENTS);
    return response.data;
};

export const getPaymentById = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT_BY_ID(id));
    return response.data;
};

export const createPayment = async (paymentData) => {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS, paymentData);
    return response.data;
};

export const updatePayment = async (id, paymentData) => {
    const response = await apiClient.put(API_ENDPOINTS.PAYMENT_BY_ID(id), paymentData);
    return response.data;
};

export const deletePayment = async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.PAYMENT_BY_ID(id));
    return response.data;
};

export const getPaymentsByPlayer = async (playerId) => {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT_BY_PLAYER(playerId));
    return response.data;
};
