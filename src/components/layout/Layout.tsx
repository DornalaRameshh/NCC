import React from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)' }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};
