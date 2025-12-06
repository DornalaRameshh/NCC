import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { Domain, DomainStatus } from '../../types/domain';

interface DomainModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (domain: Omit<Domain, 'id'>) => void;
    initialData?: Domain | null;
}

export const DomainModal = ({ isOpen, onClose, onSave, initialData }: DomainModalProps) => {
    const [formData, setFormData] = useState<Partial<Domain>>({
        name: '',
        registrar: '',
        registrationDate: '',
        expiryDate: '',
        owner: '',
        autoRenew: true,
        status: 'active',
        cost: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                registrar: '',
                registrationDate: '',
                expiryDate: '',
                owner: '',
                autoRenew: true,
                status: 'active',
                cost: 0
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Omit<Domain, 'id'>);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{initialData ? 'Edit Domain' : 'Add New Domain'}</h2>
                    <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                        {/* Domain Name */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Domain Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-primary)'
                                }}
                                placeholder="e.g., example.com"
                            />
                        </div>

                        {/* Registrar */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Registrar</label>
                            <input
                                type="text"
                                required
                                value={formData.registrar}
                                onChange={e => setFormData({ ...formData, registrar: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-primary)'
                                }}
                                placeholder="e.g., GoDaddy"
                            />
                        </div>

                        {/* Owner / Client */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Owner / Client</label>
                            <input
                                type="text"
                                required
                                value={formData.owner}
                                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-primary)'
                                }}
                                placeholder="e.g., Internal Product"
                            />
                        </div>

                        {/* Registration Date */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Registration Date</label>
                            <input
                                type="date"
                                required
                                value={formData.registrationDate}
                                onChange={e => setFormData({ ...formData, registrationDate: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-primary)'
                                }}
                            />
                        </div>

                        {/* Expiry Date */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Expiry Date</label>
                            <input
                                type="date"
                                required
                                value={formData.expiryDate}
                                onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-primary)'
                                }}
                            />
                        </div>

                        {/* Cost */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Annual Cost ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.cost}
                                onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-primary)'
                                }}
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as DomainStatus })}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem',
                                    backgroundColor: 'var(--color-bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-primary)'
                                }}
                            >
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="pending_transfer">Transfer Pending</option>
                                <option value="grace_period">Grace Period</option>
                            </select>
                        </div>

                        {/* Checkbox: Auto Renew */}
                        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <input
                                type="checkbox"
                                checked={formData.autoRenew}
                                onChange={e => setFormData({ ...formData, autoRenew: e.target.checked })}
                                id="autoRenew"
                                style={{ width: '16px', height: '16px' }}
                            />
                            <label htmlFor="autoRenew" style={{ fontSize: '0.875rem' }}>Enable Auto-Renew</label>
                        </div>

                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost" style={{ border: '1px solid var(--border-color)' }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} />
                            {initialData ? 'Save Changes' : 'Add Domain'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
