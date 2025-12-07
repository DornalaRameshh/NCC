import React, { useState, useEffect } from 'react';
import type { StorageBucket, StorageType } from '../types/storage';
import { X } from 'lucide-react';

interface StorageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (storage: Omit<StorageBucket, 'id' | 'usageBytes' | 'createdDate'>) => void;
    initialData?: StorageBucket | null;
}

export const StorageModal: React.FC<StorageModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        provider: 'AWS S3',
        type: 'object' as StorageType,
        region: 'ap-south-1',
        capacityBytes: 107374182400, // 100 GB default
        isPublic: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                provider: initialData.provider,
                type: initialData.type,
                region: initialData.region,
                capacityBytes: initialData.capacityBytes,
                isPublic: initialData.isPublic
            });
        } else {
            setFormData({
                name: '',
                provider: 'AWS S3',
                type: 'object',
                region: 'ap-south-1',
                capacityBytes: 107374182400,
                isPublic: false
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.type === 'number'
                ? parseFloat(e.target.value)
                : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const gb = parseFloat(e.target.value);
        setFormData({ ...formData, capacityBytes: gb * 1024 * 1024 * 1024 });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{initialData ? 'Edit Storage' : 'Add Storage'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Storage Name</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="ncc-assets-prod"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Provider</label>
                            <select name="provider" value={formData.provider} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                                <option value="AWS S3">AWS S3</option>
                                <option value="AWS EBS">AWS EBS</option>
                                <option value="AWS EFS">AWS EFS</option>
                                <option value="GCP Cloud Storage">GCP Cloud Storage</option>
                                <option value="GCP Persistent Disk">GCP Persistent Disk</option>
                                <option value="Azure Blob">Azure Blob Storage</option>
                                <option value="Azure Files">Azure Files</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                                <option value="object">Object Storage</option>
                                <option value="block">Block Storage</option>
                                <option value="file">File Storage</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Region</label>
                            <input
                                required
                                name="region"
                                value={formData.region}
                                onChange={handleChange}
                                placeholder="ap-south-1"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Capacity (GB)</label>
                            <input
                                required
                                type="number"
                                value={Math.round(formData.capacityBytes / (1024 * 1024 * 1024))}
                                onChange={handleCapacityChange}
                                placeholder="100"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleChange}
                                style={{ width: '18px', height: '18px' }}
                            />
                            <span style={{ fontSize: '0.875rem' }}>Public Access</span>
                        </label>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Add Storage'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
