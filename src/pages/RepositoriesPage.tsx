import { useState, useEffect } from 'react';
import { RepositoryService } from '../services/repositoryService';
import { GitBranch, Plus, Search, Filter, Edit2, Trash2, ExternalLink, Circle } from 'lucide-react';
import type { Repository, CIStatus, RepoVisibility } from '../types/repository';

export const RepositoriesPage = () => {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [providerFilter, setProviderFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadRepos();
    }, []);

    const loadRepos = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await RepositoryService.getRepositories();
            setRepos(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load repositories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await RepositoryService.deleteRepository(id);
            setRepos(repos.filter(r => r.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete repository');
        }
    };

    const filteredRepos = repos.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesProvider = providerFilter === 'all' || r.provider === providerFilter;
        return matchesSearch && matchesProvider;
    });

    const getCIColor = (status: CIStatus) => {
        switch (status) {
            case 'passing': return 'var(--color-success)';
            case 'failing': return 'var(--color-danger)';
            case 'pending': return 'var(--color-warning)';
            default: return 'var(--color-text-muted)';
        }
    };

    const getVisibilityBadge = (visibility: RepoVisibility) => {
        const colors: Record<RepoVisibility, string> = {
            public: 'var(--color-success)',
            private: 'var(--color-primary)',
            internal: 'var(--color-warning)'
        };
        return colors[visibility];
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Version Control</h2>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                        Manage code repositories and CI/CD pipelines.
                    </p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Add Repository
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
                    <input type="text" placeholder="Search repositories..." value={searchText} onChange={(e) => setSearchText(e.target.value)} style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }} />
                </div>
                <button className="btn btn-ghost" style={{ border: '1px solid var(--border-color)', backgroundColor: showFilters ? 'var(--color-bg-hover)' : 'transparent' }} onClick={() => setShowFilters(!showFilters)}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            {showFilters && (
                <div className="card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)' }}>
                        <option value="all">All Providers</option>
                        <option value="GitHub">GitHub</option>
                        <option value="GitLab">GitLab</option>
                        <option value="Bitbucket">Bitbucket</option>
                    </select>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '1rem' }}>Loading repositories...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                    {filteredRepos.map(repo => (
                        <div key={repo.id} className="card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <GitBranch size={20} />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{repo.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{repo.provider}</div>
                                    </div>
                                </div>
                                <span style={{ padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.7rem', fontWeight: 500, backgroundColor: `${getVisibilityBadge(repo.visibility)}20`, color: getVisibilityBadge(repo.visibility), textTransform: 'capitalize' }}>
                                    {repo.visibility}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                <span>🔤 {repo.language}</span>
                                <span>🌿 {repo.branches} branches</span>
                                <span>⚠️ {repo.openIssues} issues</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Circle size={10} fill={getCIColor(repo.ciStatus)} color={getCIColor(repo.ciStatus)} />
                                    <span style={{ fontSize: '0.75rem', color: getCIColor(repo.ciStatus), textTransform: 'capitalize' }}>CI: {repo.ciStatus}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <a href={repo.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem' }}><ExternalLink size={16} /></a>
                                    <button className="btn btn-ghost" style={{ padding: '0.5rem' }}><Edit2 size={16} /></button>
                                    <button className="btn btn-ghost" style={{ padding: '0.5rem', color: 'var(--color-danger)' }} onClick={() => handleDelete(repo.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};
