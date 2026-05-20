import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { seedData } from './data/seed';
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import NewCase from './pages/NewCase';
import CaseDetail from './pages/CaseDetail';
import Drafts from './pages/Drafts';
import Settings from './pages/Settings';
import Anonymizer from './pages/Anonymizer';
import NotFound from './pages/NotFound';

function App() {
  // Seed initial data
  useEffect(() => {
    seedData();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cases" element={<CaseList />} />
          <Route path="/cases/new" element={<NewCase />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/drafts" element={<Drafts />} />
          <Route path="/anonymizer" element={<Anonymizer />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
