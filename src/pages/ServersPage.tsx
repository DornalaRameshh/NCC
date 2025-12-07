import { useState, useEffect } from 'react';
import { ServerList } from '../components/server/ServerList';
import { ServerModal } from '../components/server/ServerModal';
import { ServerService } from '../services/serverService';
import type { Server } from '../types/server';

export const ServersPage = () => {
    const [servers, setServers] = useState<Server[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServer, setEditingServer] = useState<Server | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch servers on component mount
    useEffect(() => {
        loadServers();
    }, []);

    const loadServers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ServerService.getServers();
            setServers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load servers');
            console.error('Error loading servers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveServer = async (serverData: Omit<Server, 'id'>) => {
        try {
            setError(null);

            if (editingServer) {
                // Update existing server
                const updated = await ServerService.updateServer(editingServer.id, serverData);
                setServers(servers.map(s => s.id === updated.id ? updated : s));
            } else {
                // Create new server
                const created = await ServerService.createServer(serverData);
                setServers([...servers, created]);
            }

            setIsModalOpen(false);
            setEditingServer(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save server');
            console.error('Error saving server:', err);
            // Keep modal open on error so user can retry
        }
    };

    const openAddModal = () => {
        setEditingServer(null);
        setIsModalOpen(true);
        setError(null);
    };

    const openEditModal = (server: Server) => {
        setEditingServer(server);
        setIsModalOpen(true);
        setError(null);
    };

    const handleDeleteServer = async (serverId: string) => {
        try {
            setError(null);
            await ServerService.deleteServer(serverId);
            setServers(servers.filter(s => s.id !== serverId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete server');
            console.error('Error deleting server:', err);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Server Management</h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                    Manage your infrastructure, including product servers, client servers, and test environments.
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--color-danger)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-danger)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{error}</span>
                    <button
                        onClick={() => setError(null)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-danger)',
                            cursor: 'pointer',
                            fontSize: '1.25rem'
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'var(--color-text-muted)'
                }}>
                    <div style={{
                        display: 'inline-block',
                        width: '40px',
                        height: '40px',
                        border: '4px solid var(--border-color)',
                        borderTopColor: 'var(--color-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ marginTop: '1rem' }}>Loading servers...</p>
                </div>
            ) : (
                <ServerList
                    servers={servers}
                    onAddClick={openAddModal}
                    onEditClick={openEditModal}
                    onDeleteClick={handleDeleteServer}
                />
            )}

            <ServerModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingServer(null);
                    setError(null);
                }}
                onSave={handleSaveServer}
                initialData={editingServer}
            />

            {/* Add spinner animation */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
