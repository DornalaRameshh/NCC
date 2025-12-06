import type { DomainStatus } from '../../types/domain';

interface DomainStatusBadgeProps {
    status: DomainStatus;
}

export const DomainStatusBadge = ({ status }: DomainStatusBadgeProps) => {
    const getStyles = (status: DomainStatus) => {
        switch (status) {
            case 'active':
                return { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399', label: 'Active' };
            case 'expired':
                return { bg: 'rgba(239, 68, 68, 0.2)', color: '#f87171', label: 'Expired' };
            case 'pending_transfer':
                return { bg: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', label: 'Transferring' };
            case 'grace_period':
                return { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', label: 'Grace Period' };
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
            border: `1px solid ${style.color}40`
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
