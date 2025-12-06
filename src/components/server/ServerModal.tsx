import React, { useState, useEffect } from 'react';
import type { Server, ServerStatus, ServerCategory } from '../../types/server';
import { X } from 'lucide-react';

interface ServerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (server: Omit<Server, 'id'>) => void;
    initialData?: Server | null;
}

export const ServerModal: React.FC<ServerModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        ipAddress: '',
        os: '',
        cpu: '',
        ram: '',
        storage: '',
        location: '',
        provider: '',
        category: 'production' as ServerCategory,
        responsibleTeam: '',
        status: 'online' as ServerStatus
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                ipAddress: initialData.ipAddress,
                os: initialData.os,
                cpu: initialData.specs.cpu,
                ram: initialData.specs.ram,
                storage: initialData.specs.storage,
                location: initialData.location,
                provider: initialData.provider,
                category: initialData.category,
                responsibleTeam: initialData.responsibleTeam,
                status: initialData.status
            });
        } else {
            // Reset for Add mode
            setFormData({
                name: '',
                ipAddress: '',
                os: '',
                cpu: '',
                ram: '',
                storage: '',
                location: '',
                provider: '',
                category: 'production' as ServerCategory,
                responsibleTeam: '',
                status: 'online' as ServerStatus
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name: formData.name,
            ipAddress: formData.ipAddress,
            os: formData.os,
            specs: {
                cpu: formData.cpu,
                ram: formData.ram,
                storage: formData.storage
            },
            location: formData.location,
            provider: formData.provider,
            status: formData.status,
            category: formData.category,
            responsibleTeam: formData.responsibleTeam,
            lastPatchDate: initialData?.lastPatchDate || new Date().toISOString().split('T')[0],
            tags: initialData?.tags || []
        });
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{initialData ? 'Edit Server' : 'Add New Server'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Server Name</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>IP Address</label>
                            <input
                                required
                                name="ipAddress"
                                value={formData.ipAddress}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>OS / Distro</label>
                            <input
                                required
                                name="os"
                                value={formData.os}
                                onChange={handleChange}
                                placeholder="e.g. Ubuntu 22.04"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>CPU</label>
                            <input name="cpu" value={formData.cpu} onChange={handleChange} placeholder="4 vCPU" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>RAM</label>
                            <input name="ram" value={formData.ram} onChange={handleChange} placeholder="16 GB" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Storage</label>
                            <input name="storage" value={formData.storage} onChange={handleChange} placeholder="500 GB" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Provider</label>
                            <input required name="provider" value={formData.provider} onChange={handleChange} placeholder="AWS, Azure..." style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Location</label>
                            <input required name="location" value={formData.location} onChange={handleChange} placeholder="US-East-1" style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                                <option value="production">Production</option>
                                <option value="staging">Staging</option>
                                <option value="development">Development</option>
                                <option value="testing">Testing</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Responsible Team</label>
                            <input required name="responsibleTeam" value={formData.responsibleTeam} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="warning">Warning</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Add Server'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
