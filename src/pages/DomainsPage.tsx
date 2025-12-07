import { useState, useEffect } from 'react';
import { DomainList } from '../features/domains/DomainList';
import { DomainModal } from '../features/domains/DomainModal';
import { DomainFilters } from '../features/domains/DomainFilters';
import { DomainService } from '../services/domainService';
import { Search, Filter, Plus } from 'lucide-react';
import type { Domain, DomainStatus } from '../types/domain';

export const DomainsPage = () => {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<DomainStatus | 'all'>('all');
    const [registrarFilter, setRegistrarFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDomain, setEditingDomain] = useState<Domain | null>(null);

    // Load domains on mount
    useEffect(() => {
        loadDomains();
    }, []);

    const loadDomains = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await DomainService.getDomains();
            setDomains(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load domains');
            console.error('Error loading domains:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDomains = domains.filter(d => {
        const matchesSearch =
            d.name.toLowerCase().includes(searchText.toLowerCase()) ||
            d.registrar.toLowerCase().includes(searchText.toLowerCase()) ||
            d.owner.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
        const matchesRegistrar = registrarFilter === '' || d.registrar.toLowerCase().includes(registrarFilter.toLowerCase());

        return matchesSearch && matchesStatus && matchesRegistrar;
    });

    const handleSaveDomain = async (domainData: Omit<Domain, 'id'>) => {
        try {
            setError(null);

            if (editingDomain) {
                // Update
                const updated = await DomainService.updateDomain(editingDomain.id, domainData);
                setDomains(domains.map(d => d.id === updated.id ? updated : d));
            } else {
                // Create
                const created = await DomainService.createDomain(domainData);
                setDomains([...domains, created]);
            }

            setIsModalOpen(false);
            setEditingDomain(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save domain');
            console.error('Error saving domain:', err);
        }
    };

    const handleDeleteDomain = async (id: string) => {
        try {
            setError(null);
            await DomainService.deleteDomain(id);
            setDomains(domains.filter(d => d.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete domain');
            console.error('Error deleting domain:', err);
        }
    };

    const openAddModal = () => {
        setEditingDomain(null);
        setIsModalOpen(true);
        setError(null);
    };

    const openEditModal = (domain: Domain) => {
        setEditingDomain(domain);
        setIsModalOpen(true);
        setError(null);
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setRegistrarFilter('');
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Domain & DNS</h2>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                        Manage domain registrations, SSL certificates, and DNS records.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={openAddModal}>
                    <Plus size={18} /> Add Domain
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: 'rgba(239,68, 68, 0.1)',
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="w-full-mobile" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search domains..."
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
                    <button
                        className="btn btn-ghost"
                        style={{
                            border: '1px solid var(--border-color)',
                            backgroundColor: showFilters ? 'var(--color-bg-hover)' : 'transparent'
                        }}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                {showFilters && (
                    <DomainFilters
                        statusFilter={statusFilter}
                        registrarFilter={registrarFilter}
                        onStatusChange={setStatusFilter}
                        onRegistrarChange={setRegistrarFilter}
                        onClear={clearFilters}
                    />
                )}
            </div>

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
                    <p style={{ marginTop: '1rem' }}>Loading domains...</p>
                </div>
            ) : (
                <DomainList
                    domains={filteredDomains}
                    onEdit={openEditModal}
                    onDelete={handleDeleteDomain}
                />
            )}

            <DomainModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingDomain(null);
                    setError(null);
                }}
                onSave={handleSaveDomain}
                initialData={editingDomain}
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
