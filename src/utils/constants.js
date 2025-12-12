// User Roles
export const ROLES = {
    ADMIN: 'Admin',
    COACH: 'Coach',
    PARENT: 'Parent',
    PLAYER: 'Player'
};

// Attendance Status
export const ATTENDANCE_STATUS = {
    PRESENT: 'Present',
    ABSENT: 'Absent',
    LATE: 'Late',
    EXCUSED: 'Excused'
};

// Payment Status
export const PAYMENT_STATUS = {
    PAID: 'Paid',
    PENDING: 'Pending',
    OVERDUE: 'Overdue',
    PARTIAL: 'Partial'
};

// Sports Types
export const SPORTS = {
    FOOTBALL: 'Football',
    BASKETBALL: 'Basketball',
    SWIMMING: 'Swimming',
    TENNIS: 'Tennis'
};

// Gender Options
export const GENDER = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other'
};

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // Players
    PLAYERS: '/players',
    PLAYER_BY_ID: (id) => `/players/${id}`,

    // Coaches
    COACHES: '/coaches',
    COACH_BY_ID: (id) => `/coaches/${id}`,

    // Parents
    PARENTS: '/parents',
    PARENT_BY_ID: (id) => `/parents/${id}`,
    PARENT_CHILDREN: (id) => `/parents/${id}/children`,

    // Attendance
    ATTENDANCE: '/attendance',
    ATTENDANCE_BY_ID: (id) => `/attendance/${id}`,
    ATTENDANCE_BY_PLAYER: (playerId) => `/attendance/player/${playerId}`,
    ATTENDANCE_MARK: '/attendance/mark',

    // Payments
    PAYMENTS: '/payments',
    PAYMENT_BY_ID: (id) => `/payments/${id}`,
    PAYMENT_BY_PLAYER: (playerId) => `/payments/player/${playerId}`,

    // Announcements
    ANNOUNCEMENTS: '/announcements',
    ANNOUNCEMENT_BY_ID: (id) => `/announcements/${id}`,

    // Training Schedule
    SCHEDULE: '/schedule',
    SCHEDULE_BY_ID: (id) => `/schedule/${id}`,

    // Analytics (Admin)
    ANALYTICS: '/analytics',
    REPORTS: '/reports'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_INFO: 'user_info'
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Date Formats
export const DATE_FORMATS = {
    DISPLAY: 'MMM dd, yyyy',
    DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
    API: 'yyyy-MM-dd',
    API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss"
};
