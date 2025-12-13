import { format, parseISO } from 'date-fns';
import { DATE_FORMATS } from './constants';

/**
 * Format date for display
 */
export const formatDate = (date, formatStr = DATE_FORMATS.DISPLAY) => {
    if (!date) return '';

    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatStr);
    } catch (error) {
        console.error('Date formatting error:', error);
        return '';
    }
};

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 0) => {
    if (value === null || value === undefined) return '';

    return `${value.toFixed(decimals)}%`;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
    if (!name) return '';

    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
    if (!phone) return '';

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }

    return phone;
};
