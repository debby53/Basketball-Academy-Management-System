import './Card.css';

const Card = ({
    children,
    title,
    subtitle,
    headerAction,
    footer,
    className = '',
    ...props
}) => {
    return (
        <div className={`card ${className}`} {...props}>
            {(title || subtitle || headerAction) && (
                <div className="card-header">
                    <div className="card-header-content">
                        {title && <h3 className="card-title">{title}</h3>}
                        {subtitle && <p className="card-subtitle">{subtitle}</p>}
                    </div>
                    {headerAction && (
                        <div className="card-header-action">
                            {headerAction}
                        </div>
                    )}
                </div>
            )}

            <div className="card-body">
                {children}
            </div>

            {footer && (
                <div className="card-footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
