import { useState, useEffect } from 'react';
import { EmailService } from '../services/emailService';
import { Mail, Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import type { EmailAccount, EmailStatus } from '../types/email';

export const EmailsPage = () => {
    const [emails, setEmails] = useState<EmailAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<EmailStatus | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadEmails();
    }, []);

    const loadEmails = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await EmailService.getEmails();
            setEmails(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load emails');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await EmailService.deleteEmail(id);
            setEmails(emails.filter(e => e.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete email');
        }
    };

    const filteredEmails = emails.filter(e => {
        const matchesSearch = e.email.toLowerCase().includes(searchText.toLowerCase()) ||
            e.displayName.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: EmailStatus) => {
        switch (status) {
            case 'active': return 'var(--color-success)';
            case 'suspended': return 'var(--color-danger)';
            case 'pending': return 'var(--color-warning)';
        }
    };

    const formatQuota = (used: number, limit: number) => {
        const usedGB = (used / 1024).toFixed(1);
        const limitGB = (limit / 1024).toFixed(1);
        const percent = Math.round((used / limit) * 100);
        return { usedGB, limitGB, percent };
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Email Management</h2>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                        Manage email accounts, quotas, and access permissions.
                    </p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Add Email
                </button>
            </div>

            {error && (
                <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{error}</span>
                    <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '1.25rem' }}>×</button>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="w-full-mobile" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input type="text" placeholder="Search emails..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }} />
                </div>
                <button className="btn btn-ghost" style={{ border: '1px solid var(--border-color)', backgroundColor: showFilters ? 'var(--color-bg-hover)' : 'transparent' }} onClick={() => setShowFilters(!showFilters)}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            {showFilters && (
                <div className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as EmailStatus | 'all')} style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '1rem' }}>Loading email accounts...</p>
                </div>
            ) : (
                <div className="table-container">
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Provider</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Department</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Quota</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Status</th>
                                <th style={{ textAlign: 'right', padding: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmails.map(email => {
                                const quota = formatQuota(email.quotaUsed, email.quotaLimit);
                                return (
                                    <tr key={email.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Mail size={18} color="white" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{email.displayName}</div>
                                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{email.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>{email.provider}</td>
                                        <td style={{ padding: '0.75rem' }}>{email.department}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '100px', height: '6px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${quota.percent}%`, height: '100%', backgroundColor: quota.percent > 80 ? 'var(--color-danger)' : 'var(--color-primary)' }} />
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{quota.usedGB}/{quota.limitGB} GB</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 500, backgroundColor: `${getStatusColor(email.status)}20`, color: getStatusColor(email.status), textTransform: 'capitalize' }}>
                                                {email.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                            <button className="btn btn-ghost" style={{ padding: '0.5rem' }}><Edit2 size={16} /></button>
                                            <button className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => handleDelete(email.id)}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
