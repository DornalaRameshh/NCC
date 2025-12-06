import type { DNSRecord } from '../../types/domain';
import { Copy, Plus, Trash2, Edit2 } from 'lucide-react';

interface DNSRecordsTableProps {
    records?: DNSRecord[];
}

export const DNSRecordsTable = ({ records = [] }: DNSRecordsTableProps) => {
    return (
        <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>DNS Records</h3>
                <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                    <Plus size={16} /> Add Record
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                    <tr>
                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Type</th>
                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Name</th>
                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Value</th>
                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>TTL</th>
                        <th style={{ padding: '0.75rem 1rem', width: '80px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                No DNS records found.
                            </td>
                        </tr>
                    ) : (
                        records.map(record => (
                            <tr key={record.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{record.type}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>{record.name}</td>
                                <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {record.value}
                                        </span>
                                        <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--color-text-muted)' }} title="Copy">
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>{record.ttl}</td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--color-text-muted)' }}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="btn btn-ghost" style={{ padding: '4px', color: 'var(--color-danger)' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
