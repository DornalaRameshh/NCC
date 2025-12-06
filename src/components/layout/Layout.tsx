import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                {/* Mobile Header */}
                <div className="visible-mobile" style={{
                    padding: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: 'var(--color-bg-secondary)'
                }}>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="btn btn-ghost"
                        style={{ padding: '0.5rem' }}
                    >
                        <Menu size={24} />
                    </button>
                    <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>NCC Admin</span>
                </div>

                <div className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
                    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
