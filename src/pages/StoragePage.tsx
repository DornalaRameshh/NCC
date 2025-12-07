import { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { HardDrive, Plus, Search, Filter, Edit2, Trash2, Cloud } from 'lucide-react';
import type { StorageBucket, StorageType } from '../types/storage';

export const StoragePage = () => {
    const [storage, setStorage] = useState<StorageBucket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<StorageType | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadStorage();
    }, []);

    const loadStorage = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await StorageService.getStorage();
            setStorage(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load storage');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await StorageService.deleteStorage(id);
            setStorage(storage.filter(s => s.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete storage');
        }
    };

    const filteredStorage = storage.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesType = typeFilter === 'all' || s.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const formatBytes = (bytes: number) => {
        const gb = bytes / (1024 * 1024 * 1024);
        if (gb >= 1000) return `${(gb / 1024).toFixed(1)} TB`;
        return `${gb.toFixed(1)} GB`;
    };

    const getUsagePercent = (used: number, capacity: number) => Math.round((used / capacity) * 100);

    const getUsageColor = (percent: number) => {
        if (percent >= 90) return 'var(--color-danger)';
        if (percent >= 70) return 'var(--color-warning)';
        return 'var(--color-success)';
    };

    const getTypeIcon = (type: StorageType) => {
        switch (type) {
            case 'object': return <Cloud size={20} />;
            case 'block': return <HardDrive size={20} />;
            case 'file': return <HardDrive size={20} />;
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Storage Management</h2>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                        Manage cloud storage buckets and volumes.
                    </p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Add Storage
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
                    <input type="text" placeholder="Search storage..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }} />
                </div>
                <button className="btn btn-ghost" style={{ border: '1px solid var(--border-color)', backgroundColor: showFilters ? 'var(--color-bg-hover)' : 'transparent' }} onClick={() => setShowFilters(!showFilters)}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            {showFilters && (
                <div className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as StorageType | 'all')} style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}>
                        <option value="all">All Types</option>
                        <option value="object">Object Storage</option>
                        <option value="block">Block Storage</option>
                        <option value="file">File Storage</option>
                    </select>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '1rem' }}>Loading storage...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                    {filteredStorage.map(item => {
                        const percent = getUsagePercent(item.usageBytes, item.capacityBytes);
                        return (
                            <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {getTypeIcon(item.type)}
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.provider}</div>
                                        </div>
                                    </div>
                                    <span style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 500, backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--border-color)', textTransform: 'capitalize' }}>
                                        {item.type}
                                    </span>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                        <span style={{ color: 'var(--color-text-muted)' }}>Usage</span>
                                        <span style={{ fontWeight: 500, color: getUsageColor(percent) }}>{percent}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-bg-primary)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: getUsageColor(percent), transition: 'width 0.3s ease' }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        <span>{formatBytes(item.usageBytes)} used</span>
                                        <span>{formatBytes(item.capacityBytes)} total</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                    <span>📍 {item.region}</span>
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button className="btn btn-ghost" style={{ padding: '0.5rem' }}><Edit2 size={16} /></button>
                                        <button className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
