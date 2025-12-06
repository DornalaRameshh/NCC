import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Server,
    Globe,
    Mail,
    Database,
    GitBranch,
    Settings,
    ShieldAlert,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const sidebarStyle: React.CSSProperties = {
        width: '260px',
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        zIndex: 50,
        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.3s ease-in-out',
        boxShadow: isMobile && isOpen ? '0 0 15px rgba(0,0,0,0.5)' : 'none'
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobile && isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 40
                    }}
                />
            )}

            <aside style={sidebarStyle}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                            NCC Admin
                        </h1>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                            Operations Platform
                        </div>
                    </div>
                    {isMobile && (
                        <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
                            <X size={20} />
                        </button>
                    )}
                </div>

                <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => isMobile && onClose()}
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
        </>
    );
};
