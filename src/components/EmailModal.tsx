import React, { useState, useEffect } from 'react';
import type { EmailAccount, EmailStatus } from '../types/email';
import { X } from 'lucide-react';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (email: Omit<EmailAccount, 'id' | 'quotaUsed'>) => void;
    initialData?: EmailAccount | null;
}

export const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        email: '',
        displayName: '',
        provider: 'Google Workspace',
        department: '',
        quotaLimit: 15360,
        status: 'active' as EmailStatus,
        createdDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                email: initialData.email,
                displayName: initialData.displayName,
                provider: initialData.provider,
                department: initialData.department,
                quotaLimit: initialData.quotaLimit,
                status: initialData.status,
                createdDate: initialData.createdDate
            });
        } else {
            setFormData({
                email: '',
                displayName: '',
                provider: 'Google Workspace',
                department: '',
                quotaLimit: 15360,
                status: 'active',
                createdDate: new Date().toISOString().split('T')[0]
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
        const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{initialData ? 'Edit Email Account' : 'Add Email Account'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@company.com"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Display Name</label>
                        <input
                            required
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Provider</label>
                            <select name="provider" value={formData.provider} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                                <option value="Google Workspace">Google Workspace</option>
                                <option value="Microsoft 365">Microsoft 365</option>
                                <option value="Zoho Mail">Zoho Mail</option>
                                <option value="ProtonMail">ProtonMail</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Department</label>
                            <input
                                required
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="Engineering"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Quota Limit (MB)</label>
                            <input
                                required
                                type="number"
                                name="quotaLimit"
                                value={formData.quotaLimit}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Add Email'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
