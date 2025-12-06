import { X } from 'lucide-react';
import type { DomainStatus } from '../../types/domain';

interface DomainFiltersProps {
    statusFilter: DomainStatus | 'all';
    registrarFilter: string;
    onStatusChange: (status: DomainStatus | 'all') => void;
    onRegistrarChange: (registrar: string) => void;
    onClear: () => void;
}

export const DomainFilters = ({
    statusFilter,
    registrarFilter,
    onStatusChange,
    onRegistrarChange,
    onClear
}: DomainFiltersProps) => {
    return (
        <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', backgroundColor: 'var(--color-bg-secondary)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Filters:</span>

            <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value as DomainStatus | 'all')}
                style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)'
                }}
            >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending_transfer">Transfer Pending</option>
                <option value="grace_period">Grace Period</option>
            </select>

            <input
                type="text"
                placeholder="Filter by Registrar..."
                value={registrarFilter}
                onChange={(e) => onRegistrarChange(e.target.value)}
                style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)',
                    width: '180px'
                }}
            />

            {(statusFilter !== 'all' || registrarFilter !== '') && (
                <button
                    onClick={onClear}
                    className="btn btn-ghost"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                >
                    <X size={14} /> Clear
                </button>
            )}
        </div>
    );
};
