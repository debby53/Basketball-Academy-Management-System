import { useState } from 'react';
import Card from '../ui/Card';
import './AttendanceHistory.css';
import { DATE_FORMATS, ATTENDANCE_STATUS } from '../../utils/constants';
import { format } from 'date-fns'; // Assuming date-fns is available or I use native formatting

const AttendanceHistory = ({ events, filter, onFilterChange, isLoading }) => {

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case ATTENDANCE_STATUS.PRESENT:
                return 'status-present';
            case ATTENDANCE_STATUS.ABSENT:
                return 'status-absent';
            case ATTENDANCE_STATUS.LATE:
                return 'status-late';
            default:
                return 'status-default';
        }
    };

    return (
        <Card className="attendance-history-card">
            <div className="history-header">
                <h3>Attendance History</h3>
                <div className="filter-controls">
                    <select
                        value={filter}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="filter-select"
                        disabled={isLoading}
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            <div className="history-content">
                {isLoading ? (
                    <div className="loading-state">Loading records...</div>
                ) : events && events.length > 0 ? (
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Event</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id} className={event.status === ATTENDANCE_STATUS.ABSENT ? 'row-absent' : ''}>
                                    <td>{formatDate(event.date)}</td>
                                    <td>
                                        <span className="event-name">{event.eventName || 'Training'}</span>
                                    </td>
                                    <td>{event.type}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <p>No attendance records found for this period.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AttendanceHistory;
