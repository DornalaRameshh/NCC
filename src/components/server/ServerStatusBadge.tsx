import type { ServerStatus } from '../../types/server';

interface ServerStatusBadgeProps {
    status: ServerStatus;
}

export const ServerStatusBadge: React.FC<ServerStatusBadgeProps> = ({ status }) => {
    const getStyles = (status: ServerStatus) => {
        switch (status) {
            case 'online':
                return { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399', label: 'Online' };
            case 'offline':
                return { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', label: 'Offline' };
            case 'maintenance':
                return { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', label: 'Maintenance' };
            case 'warning':
                return { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', label: 'Warning' };
            default:
                return { bg: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', label: 'Unknown' };
        }
    };

    const style = getStyles(status);

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.25rem 0.5rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: style.bg,
            color: style.color,
            textTransform: 'capitalize',
            border: `1px solid ${style.color}40` // 25% opacity border
        }}>
            <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: style.color,
                marginRight: '0.375rem'
            }} />
            {style.label}
        </span>
    );
};
