import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
    const sizeClass = `spinner-${size}`;
    const colorClass = `spinner-${color}`;

    return (
        <div className="spinner-wrapper">
            <div className={`spinner ${sizeClass} ${colorClass}`}></div>
        </div>
    );
};

export default LoadingSpinner;
