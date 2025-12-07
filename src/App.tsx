import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ServersPage } from './pages/ServersPage';
import { ServerDetailsPage } from './pages/ServerDetailsPage';
import { DomainsPage } from './pages/DomainsPage';
import { DomainDetailsPage } from './pages/DomainDetailsPage';
import { EmailsPage } from './pages/EmailsPage';
import { RepositoriesPage } from './pages/RepositoriesPage';
import { StoragePage } from './pages/StoragePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/servers" element={<ServersPage />} />
          <Route path="/servers/:id" element={<ServerDetailsPage />} />
          <Route path="/domains" element={<DomainsPage />} />
          <Route path="/domains/:id" element={<DomainDetailsPage />} />
          <Route path="/email" element={<EmailsPage />} />
          <Route path="/vcs" element={<RepositoriesPage />} />
          <Route path="/storage" element={<StoragePage />} />
          {/* Placeholders for remaining routes */}
          <Route path="/incidents" element={<div className="card" style={{ padding: '2rem' }}>Incident Management Coming Soon</div>} />
          <Route path="/settings" element={<div className="card" style={{ padding: '2rem' }}>Settings Coming Soon</div>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
