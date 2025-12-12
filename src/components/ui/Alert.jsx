import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './Alert.css';

const Alert = ({
    type = 'info',
    title,
    message,
    onClose,
    className = ''
}) => {
    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />
    };

    return (
        <div className={`alert alert-${type} ${className}`}>
            <div className="alert-icon">
                {icons[type]}
            </div>

            <div className="alert-content">
                {title && <div className="alert-title">{title}</div>}
                <div className="alert-message">{message}</div>
            </div>

            {onClose && (
                <button className="alert-close" onClick={onClose}>
                    <X size={18} />
                </button>
            )}
        </div>
    );
};

export default Alert;
