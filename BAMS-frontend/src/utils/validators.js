/**
 * Validate email address
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password) => {
    if (password.length < 8) return false;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasUpperCase && hasLowerCase && hasNumber;
};

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return phoneRegex.test(phone);
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
};

/**
 * Validate minimum length
 */
export const minLength = (value, min) => {
    if (!value) return false;
    return value.length >= min;
};

/**
 * Validate maximum length
 */
export const maxLength = (value, max) => {
    if (!value) return true;
    return value.length <= max;
};

/**
 * Get password strength
 */
export const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'None' };

    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'danger' };
    if (strength <= 4) return { strength, label: 'Medium', color: 'warning' };
    return { strength, label: 'Strong', color: 'success' };
};
