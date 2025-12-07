import React, { useState, useEffect } from 'react';
import type { Repository, RepoVisibility, CIStatus } from '../types/repository';
import { X } from 'lucide-react';

interface RepositoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (repo: Omit<Repository, 'id' | 'branches' | 'openIssues'>) => void;
    initialData?: Repository | null;
}

export const RepositoryModal: React.FC<RepositoryModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        provider: 'GitHub',
        language: 'TypeScript',
        visibility: 'private' as RepoVisibility,
        ownerTeam: '',
        ciStatus: 'none' as CIStatus
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                url: initialData.url,
                provider: initialData.provider,
                language: initialData.language,
                visibility: initialData.visibility,
                ownerTeam: initialData.ownerTeam,
                ciStatus: initialData.ciStatus
            });
        } else {
            setFormData({
                name: '',
                url: '',
                provider: 'GitHub',
                language: 'TypeScript',
                visibility: 'private',
                ownerTeam: '',
                ciStatus: 'none'
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
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{initialData ? 'Edit Repository' : 'Add Repository'}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Repository Name</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="ncc-frontend"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Repository URL</label>
                        <input
                            required
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="https://github.com/username/repo"
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Provider</label>
                            <select name="provider" value={formData.provider} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                                <option value="GitHub">GitHub</option>
                                <option value="GitLab">GitLab</option>
                                <option value="Bitbucket">Bitbucket</option>
                                <option value="Azure DevOps">Azure DevOps</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Language</label>
                            <select name="language" value={formData.language} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                                <option value="TypeScript">TypeScript</option>
                                <option value="JavaScript">JavaScript</option>
                                <option value="Python">Python</option>
                                <option value="Java">Java</option>
                                <option value="Go">Go</option>
                                <option value="Rust">Rust</option>
                                <option value="Kotlin">Kotlin</option>
                                <option value="YAML">YAML</option>
                                <option value="Markdown">Markdown</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Visibility</label>
                            <select name="visibility" value={formData.visibility} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                                <option value="internal">Internal</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Owner Team</label>
                            <input
                                required
                                name="ownerTeam"
                                value={formData.ownerTeam}
                                onChange={handleChange}
                                placeholder="Backend Team"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>CI/CD Status</label>
                        <select name="ciStatus" value={formData.ciStatus} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--color-bg-primary)', color: 'white' }}>
                            <option value="passing">Passing</option>
                            <option value="failing">Failing</option>
                            <option value="pending">Pending</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn btn-primary">{initialData ? 'Save Changes' : 'Add Repository'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
