import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CaseList from './pages/CaseList';
import NewCase from './pages/NewCase';
import CaseDetail from './pages/CaseDetail';
import Drafts from './pages/Drafts';
import Settings from './pages/Settings';
import Anonymizer from './pages/Anonymizer';
import UserManagement from './pages/UserManagement';
import AuditLogs from './pages/AuditLogs';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/cases" element={<CaseList />} />
                    <Route path="/cases/new" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'STAFF']}><NewCase /></ProtectedRoute>} />
                    <Route path="/cases/:id" element={<CaseDetail />} />
                    <Route path="/drafts" element={<Drafts />} />
                    <Route path="/anonymizer" element={<Anonymizer />} />
                    <Route path="/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
                    <Route path="/audit-logs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AuditLogs /></ProtectedRoute>} />
                    <Route path="/analytics" element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}><AnalyticsDashboard /></ProtectedRoute>} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
