import apiClient from './apiClient';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get all attendance records
 */
export const getAllAttendance = async (params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE, { params });
    return response.data;
};

/**
 * Get attendance by player ID
 */
export const getAttendanceByPlayer = async (playerId, params = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE_BY_PLAYER(playerId), { params });
    return response.data;
};

/**
 * Mark attendance
 */
export const markAttendance = async (attendanceData) => {
    const response = await apiClient.post(API_ENDPOINTS.ATTENDANCE_MARK, attendanceData);
    return response.data;
};

/**
 * Update attendance record
 */
export const updateAttendance = async (id, attendanceData) => {
    const response = await apiClient.put(API_ENDPOINTS.ATTENDANCE_BY_ID(id), attendanceData);
    return response.data;
};
