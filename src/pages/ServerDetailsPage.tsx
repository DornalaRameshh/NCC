import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ServerService } from '../services/serverService';
import { ServerStatusBadge } from '../components/server/ServerStatusBadge';
import { ArrowLeft, Cpu, HardDrive, Globe, Shield, User, Calendar, Tag } from 'lucide-react';
import type { Server } from '../types/server';

export const ServerDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [server, setServer] = useState<Server | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadServer(id);
        }
    }, [id]);

    const loadServer = async (serverId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await ServerService.getServer(serverId);
            setServer(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load server');
            console.error('Error loading server:', err);
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
                <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading server details...</p>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error || !server) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: 'var(--color-danger)' }}>
                    {error || 'Server not found'}
                </h2>
                <button onClick={() => navigate('/servers')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                    <ArrowLeft size={18} />
                    Back to Servers
                </button>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/servers')}
                    className="btn btn-ghost"
                    style={{ paddingLeft: 0, marginBottom: '1rem' }}
                >
                    <ArrowLeft size={18} />
                    Back to Servers
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{server.name}</h1>
                        <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span>{server.ipAddress}</span>
                            <span>•</span>
                            <span>{server.location}</span>
                        </div>
                    </div>
                    <ServerStatusBadge status={server.status} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Hardware Specs</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>CPU</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                    <Cpu size={18} /> {server.specs.cpu}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Memory</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                    <HardDrive size={18} /> {server.specs.ram}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Storage</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                    <HardDrive size={18} /> {server.specs.storage}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Operating System</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                    <Shield size={18} /> {server.os}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Category & Environment</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                                fontSize: '0.875rem',
                                backgroundColor: 'var(--color-bg-secondary)',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                textTransform: 'capitalize'
                            }}>
                                {server.category}
                            </span>
                        </div>
                    </div>

                </div>

                {/* Sidebar Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Details</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Provider</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Globe size={16} /> {server.provider}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Responsible Team</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={16} /> {server.responsibleTeam}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Last Patch</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} /> {server.lastPatchDate}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Tags</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {server.tags?.map(tag => (
                                        <span key={tag} style={{
                                            fontSize: '0.75rem',
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <Tag size={12} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
