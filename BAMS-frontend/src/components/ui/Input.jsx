import './Input.css';

const Input = ({
    label,
    type = 'text',
    error,
    icon,
    className = '',
    required = false,
    ...props
}) => {
    const inputClass = `input ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''} ${className}`;

    return (
        <div className="input-wrapper">
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}

            <div className="input-container">
                {icon && (
                    <span className="input-icon">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    className={inputClass}
                    {...props}
                />
            </div>

            {error && (
                <span className="input-error-message">{error}</span>
            )}
        </div>
    );
};

export default Input;
