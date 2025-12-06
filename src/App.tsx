import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ServersPage } from './pages/ServersPage';

import { ServerDetailsPage } from './pages/ServerDetailsPage';
import { DomainsPage } from './pages/DomainsPage';
import { DomainDetailsPage } from './pages/DomainDetailsPage';

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
          {/* Placeholders for other routes */}
          <Route path="/email" element={<div className="card p-4">Email Module Coming Soon</div>} />
          <Route path="/storage" element={<div className="card p-4">Storage Module Coming Soon</div>} />
          <Route path="/vcs" element={<div className="card p-4">Version Control Module Coming Soon</div>} />
          <Route path="/incidents" element={<div className="card p-4">Incident Management Coming Soon</div>} />
          <Route path="/settings" element={<div className="card p-4">Settings Coming Soon</div>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
