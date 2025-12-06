import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface ExpiryIndicatorProps {
    expiryDate: string;
}

export const ExpiryIndicator = ({ expiryDate }: ExpiryIndicatorProps) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let color = '#34d399'; // Green
    let icon = <CheckCircle size={14} />;
    let text = `${diffDays} days left`;
    if (diffDays < 0) {
        color = '#ef4444'; // Red
        icon = <AlertTriangle size={14} />;
        text = `Expired ${Math.abs(diffDays)} days ago`;
    } else if (diffDays <= 30) {
        color = '#ef4444'; // Red
        icon = <AlertTriangle size={14} />;
    } else if (diffDays <= 60) {
        color = '#f59e0b'; // Yellow
        icon = <Clock size={14} />;
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: color, fontSize: '0.875rem', fontWeight: 500 }}>
            {icon}
            <span>{text}</span>
        </div>
    );
};
