import { useNavigate } from 'react-router-dom';
import type { Domain } from '../../types/domain';
import { DomainStatusBadge } from './DomainStatusBadge';
import { ExpiryIndicator } from './ExpiryIndicator';
import { Globe, ShieldCheck, Edit2, Trash2 } from 'lucide-react';

interface DomainListProps {
    domains: Domain[];
    onEdit: (domain: Domain) => void;
    onDelete: (id: string) => void;
}

export const DomainList = ({ domains, onEdit, onDelete }: DomainListProps) => {
    const navigate = useNavigate();

    return (
        <div className="card" style={{ overflow: 'hidden' }}>
            <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Domain Name</th>
                            <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Registrar</th>
                            <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Expiry</th>
                            <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>SSL Status</th>
                            <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Auto Renew</th>
                            <th style={{ padding: '1rem', width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {domains.map(domain => (
                            <tr
                                key={domain.id}
                                style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                onClick={() => navigate(`/domains/${domain.id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)' }}>
                                            <Globe size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{domain.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{domain.owner}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{domain.registrar}</td>
                                <td style={{ padding: '1rem' }}>
                                    <DomainStatusBadge status={domain.status} />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <ExpiryIndicator expiryDate={domain.expiryDate} />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {domain.ssl ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <ShieldCheck size={16} color={domain.ssl.status === 'valid' ? 'var(--color-success)' : 'var(--color-danger)'} />
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{domain.ssl.issuer}</span>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {domain.autoRenew ? (
                                        <span style={{ color: 'var(--color-success)', fontSize: '0.875rem', fontWeight: 500 }}>Active</span>
                                    ) : (
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Disabled</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }} onClick={(e) => e.stopPropagation()}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ padding: '4px', color: 'var(--color-text-muted)' }}
                                            onClick={() => onEdit(domain)}
                                            title="Edit Domain"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ padding: '4px', color: 'var(--color-danger)' }}
                                            onClick={() => {
                                                if (window.confirm('Delete this domain?')) {
                                                    onDelete(domain.id);
                                                }
                                            }}
                                            title="Delete Domain"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
