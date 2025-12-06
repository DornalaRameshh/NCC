import { useState } from 'react';
import { ServerList } from '../components/server/ServerList';
import { ServerModal } from '../components/server/ServerModal';
import { mockServers } from '../data/mockServers';
import type { Server } from '../types/server';

export const ServersPage = () => {
    const [servers, setServers] = useState<Server[]>(mockServers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServer, setEditingServer] = useState<Server | null>(null);

    const handleSaveServer = (serverData: Omit<Server, 'id'>) => {
        if (editingServer) {
            // Update existing
            const updatedServers = servers.map(s =>
                s.id === editingServer.id ? { ...serverData, id: s.id } : s
            );
            setServers(updatedServers);
        } else {
            // Create new
            const newServer: Server = {
                ...serverData,
                id: `srv-${Date.now()}`
            };
            setServers([...servers, newServer]);
        }
    };

    const openAddModal = () => {
        setEditingServer(null);
        setIsModalOpen(true);
    };

    const openEditModal = (server: Server) => {
        setEditingServer(server);
        setIsModalOpen(true);
    };

    const handleDeleteServer = (serverId: string) => {
        setServers(servers.filter(s => s.id !== serverId));
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Server Management</h2>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                    Manage your infrastructure, including product servers, client servers, and test environments.
                </p>
            </div>

            <ServerList
                servers={servers}
                onAddClick={openAddModal}
                onEditClick={openEditModal}
                onDeleteClick={handleDeleteServer}
            />

            <ServerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveServer}
                initialData={editingServer}
            />
        </div>
    );
};
