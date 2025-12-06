import { useState } from 'react';
import { DomainList } from '../features/domains/DomainList';
import { DomainModal } from '../features/domains/DomainModal';
import { DomainFilters } from '../features/domains/DomainFilters';
import { mockDomains } from '../data/mockDomains';
import { Search, Filter, Plus } from 'lucide-react';
import type { Domain, DomainStatus } from '../types/domain';

export const DomainsPage = () => {
    const [domains, setDomains] = useState<Domain[]>(mockDomains);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<DomainStatus | 'all'>('all');
    const [registrarFilter, setRegistrarFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDomain, setEditingDomain] = useState<Domain | null>(null);

    const filteredDomains = domains.filter(d => {
        const matchesSearch =
            d.name.toLowerCase().includes(searchText.toLowerCase()) ||
            d.registrar.toLowerCase().includes(searchText.toLowerCase()) ||
            d.owner.toLowerCase().includes(searchText.toLowerCase());

        const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
        const matchesRegistrar = registrarFilter === '' || d.registrar.toLowerCase().includes(registrarFilter.toLowerCase());

        return matchesSearch && matchesStatus && matchesRegistrar;
    });

    const handleSaveDomain = (domainData: Omit<Domain, 'id'>) => {
        if (editingDomain) {
            // Update
            const updatedDomains = domains.map(d =>
                d.id === editingDomain.id ? { ...domainData, id: d.id, ssl: d.ssl, dnsRecords: d.dnsRecords } : d
            );
            setDomains(updatedDomains);
        } else {
            // Create
            const newDomain: Domain = {
                ...domainData,
                id: `dom-${Date.now()}`
            };
            setDomains([...domains, newDomain]);
        }
    };

    const handleDeleteDomain = (id: string) => {
        setDomains(domains.filter(d => d.id !== id));
    };

    const openAddModal = () => {
        setEditingDomain(null);
        setIsModalOpen(true);
    };

    const openEditModal = (domain: Domain) => {
        setEditingDomain(domain);
        setIsModalOpen(true);
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
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

            <DomainList
                domains={filteredDomains}
                onEdit={openEditModal}
                onDelete={handleDeleteDomain}
            />

            <DomainModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveDomain}
                initialData={editingDomain}
            />
        </div>
    );
};
