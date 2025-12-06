import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Server,
    Globe,
    Mail,
    Database,
    GitBranch,
    Settings,
    ShieldAlert
} from 'lucide-react';

export const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Server, label: 'Servers', path: '/servers' },
        { icon: Globe, label: 'Domains & DNS', path: '/domains' },
        { icon: Mail, label: 'Email Solutions', path: '/email' },
        { icon: Database, label: 'Storage', path: '/storage' },
        { icon: GitBranch, label: 'Version Control', path: '/vcs' },
        { icon: ShieldAlert, label: 'Incidents', path: '/incidents' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside style={{
            width: '260px',
            backgroundColor: 'var(--color-bg-secondary)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'sticky',
            top: 0
        }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <h1 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    NCC Admin
                </h1>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    Operations Platform
                </div>
            </div>

            <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    fontWeight: isActive ? 600 : 500,
                                    transition: 'all 0.2s',
                                    borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent'
                                })}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                    }}>
                        A
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Admin User</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>admin@ncc.com</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
