import React from 'react';
import { X } from 'lucide-react';
import type { ServerCategory, ServerStatus } from '../../types/server';

interface FilterProps {
    statusFilter: ServerStatus | 'all';
    categoryFilter: ServerCategory | 'all';
    onStatusChange: (status: ServerStatus | 'all') => void;
    onCategoryChange: (category: ServerCategory | 'all') => void;
    onClear: () => void;
}

export const ServerFilters: React.FC<FilterProps> = ({
    statusFilter,
    categoryFilter,
    onStatusChange,
    onCategoryChange,
    onClear
}) => {
    return (
        <div className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', backgroundColor: 'var(--color-bg-secondary)' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Filters:</span>

            <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value as ServerStatus | 'all')}
                style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)'
                }}
            >
                <option value="all">All Statuses</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
                <option value="warning">Warning</option>
            </select>

            <select
                value={categoryFilter}
                onChange={(e) => onCategoryChange(e.target.value as ServerCategory | 'all')}
                style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)'
                }}
            >
                <option value="all">All Categories</option>
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
                <option value="testing">Testing</option>
            </select>

            {(statusFilter !== 'all' || categoryFilter !== 'all') && (
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
