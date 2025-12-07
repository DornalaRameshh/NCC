import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DomainService } from '../services/domainService';
import { DomainStatusBadge } from '../features/domains/DomainStatusBadge';
import { ExpiryIndicator } from '../features/domains/ExpiryIndicator';
import { DNSRecordsTable } from '../features/domains/DNSRecordsTable';
import { ArrowLeft, Lock } from 'lucide-react';
import type { Domain } from '../types/domain';

export const DomainDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [domain, setDomain] = useState<Domain | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'dns'>('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadDomain(id);
        }
    }, [id]);

    const loadDomain = async (domainId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await DomainService.getDomain(domainId);
            setDomain(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load domain');
            console.error('Error loading domain:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{
                    display: 'inline-block',
                    width: '40px',
                    height: '40px',
                    border: '4px solid var(--border-color)',
                    borderTopColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading domain details...</p>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error || !domain) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: 'var(--color-danger)' }}>
                    {error || 'Domain not found'}
                </h2>
                <button onClick={() => navigate('/domains')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    <ArrowLeft size={18} />
                    Back to Domains
                </button>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/domains')}
                    className="btn btn-ghost"
                    style={{ paddingLeft: 0, marginBottom: '1rem' }}
                >
                    <ArrowLeft size={18} />
                    Back to Domains
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{domain.name}</h1>
                            <DomainStatusBadge status={domain.status} />
                        </div>
                        <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span>Registrar: {domain.registrar}</span>
                            <span>•</span>
                            <span>Owner: {domain.owner}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    style={{
                        padding: '0.75rem 0',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'overview' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        color: activeTab === 'overview' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('dns')}
                    style={{
                        padding: '0.75rem 0',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'dns' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        color: activeTab === 'dns' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    DNS Records
                </button>
            </div>

            {activeTab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 350px', gap: '2rem' }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Registration Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Registration Date</div>
                                    <div style={{ fontWeight: 500 }}>{domain.registrationDate}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Expiry Date</div>
                                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {domain.expiryDate}
                                        <ExpiryIndicator expiryDate={domain.expiryDate} />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Annual Cost</div>
                                    <div style={{ fontWeight: 500 }}>${domain.cost?.toFixed(2)} / year</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Auto Renew</div>
                                    <div style={{ fontWeight: 500, color: domain.autoRenew ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                                        {domain.autoRenew ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (SSL) */}
                    <div>
                        <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lock size={18} /> SSL Certificate
                            </h3>

                            {domain.ssl ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Status</div>
                                        <div style={{ fontWeight: 600, color: domain.ssl.status === 'valid' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                                            {domain.ssl.status.replace('_', ' ').toUpperCase()}
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Issuer</div>
                                        <div>{domain.ssl.issuer}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Valid From</div>
                                        <div>{domain.ssl.validFrom}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Valid To</div>
                                        <div>{domain.ssl.validTo}</div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                    No SSL certificate detected.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'dns' && (
                <DNSRecordsTable records={domain.dnsRecords || []} />
            )}
        </div>
    );
};
