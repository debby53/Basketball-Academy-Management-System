import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get all players
 */
export const getAllPlayers = async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.PLAYERS, { params });
    return response.data;
};

/**
 * Get player by ID
 */
export const getPlayerById = async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PLAYER_BY_ID(id));
    return response.data;
};

/**
 * Create new player
 */
export const createPlayer = async (playerData) => {
    const response = await apiClient.post(API_ENDPOINTS.PLAYERS, playerData);
    return response.data;
};

/**
 * Update player
 */
export const updatePlayer = async (id, playerData) => {
    const response = await apiClient.put(API_ENDPOINTS.PLAYER_BY_ID(id), playerData);
    return response.data;
};

/**
 * Delete player
 */
export const deletePlayer = async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.PLAYER_BY_ID(id));
    return response.data;
};
