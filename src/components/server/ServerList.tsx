import { useState } from 'react';
import type { Server, ServerStatus, ServerCategory } from '../../types/server';
import { ServerCard } from './ServerCard';
import { ServerFilters } from './ServerFilters';
import { Search, Plus } from 'lucide-react';

interface ServerListProps {
    servers: Server[];
    onAddClick: () => void;
    onEditClick: (server: Server) => void;
    onDeleteClick: (serverId: string) => void;
}

export const ServerList: React.FC<ServerListProps> = ({ servers, onAddClick, onEditClick, onDeleteClick }) => {
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<ServerStatus | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<ServerCategory | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    const filteredServers = servers.filter(s => {
        const matchesSearch =
            s.name.toLowerCase().includes(searchText.toLowerCase()) ||
            s.ipAddress.includes(searchText) ||
            s.tags?.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const clearFilters = () => {
        setStatusFilter('all');
        setCategoryFilter('all');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search servers..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.625rem 1rem 0.625rem 2.5rem',
                                backgroundColor: 'var(--color-bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-primary)'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            className="btn btn-ghost"
                            style={{
                                border: '1px solid var(--border-color)',
                                backgroundColor: showFilters ? 'var(--color-bg-hover)' : 'transparent'
                            }}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filter
                        </button>
                        <button className="btn btn-primary" onClick={onAddClick}>
                            <Plus size={18} />
                            Add Server
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <ServerFilters
                        statusFilter={statusFilter}
                        categoryFilter={categoryFilter}
                        onStatusChange={setStatusFilter}
                        onCategoryChange={setCategoryFilter}
                        onClear={clearFilters}
                    />
                )}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {filteredServers.map(server => (
                    <ServerCard
                        key={server.id}
                        server={server}
                        onEdit={onEditClick}
                        onDelete={onDeleteClick}
                    />
                ))}
            </div>

            {filteredServers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    No servers found matching your criteria.
                </div>
            )}
        </div>
    );
};
