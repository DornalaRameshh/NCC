import type { Server } from '../../types/server';
import { ServerStatusBadge } from './ServerStatusBadge';
import { Cpu, HardDrive, Globe, Shield, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServerCardProps {
    server: Server;
    onEdit?: (server: Server) => void;
    onDelete?: (serverId: string) => void;
}

export const ServerCard: React.FC<ServerCardProps> = ({ server, onEdit, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{server.name}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {server.ipAddress}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {onEdit && (
                        <button
                            onClick={() => onEdit(server)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-text-muted)',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                            title="Edit Server"
                        >
                            <Edit2 size={16} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this server?')) {
                                    onDelete(server.id);
                                }
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-danger)',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                            title="Delete Server"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                    <ServerStatusBadge status={server.status} />
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={16} />
                    {server.provider} - {server.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={16} />
                    {server.os}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Cpu size={16} />
                    {server.specs.cpu}, {server.specs.ram}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HardDrive size={16} />
                    {server.specs.storage}
                </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-primary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {server.category}
                </span>
                <button
                    className="btn btn-ghost"
                    style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                    onClick={() => navigate(`/servers/${server.id}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};
