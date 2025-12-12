import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    icon = null,
    onClick,
    className = '',
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const fullWidthClass = fullWidth ? 'btn-full-width' : '';
    const loadingClass = loading ? 'btn-loading' : '';

    const classes = [
        baseClass,
        variantClass,
        sizeClass,
        fullWidthClass,
        loadingClass,
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <span className="btn-spinner"></span>
            )}
            {icon && !loading && (
                <span className="btn-icon">{icon}</span>
            )}
            <span className="btn-text">{children}</span>
        </button>
    );
};

export default Button;
