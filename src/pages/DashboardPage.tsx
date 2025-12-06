

export const DashboardPage = () => {
    return (
        <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>Dashboard</h2>
            <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <p>Welcome to the NCC Management Application.</p>
                <p>Select a module from the sidebar to get started.</p>
            </div>
        </div>
    );
};
