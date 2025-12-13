import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import { ROLES } from './utils/constants';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlayersManagement from './pages/admin/PlayersManagement';
import CoachesManagement from './pages/admin/CoachesManagement';
import ParentsManagement from './pages/admin/ParentsManagement';
import PaymentsManagement from './pages/admin/PaymentsManagement';
import CommunicationManagement from './pages/admin/CommunicationManagement';
import ReportsManagement from './pages/admin/ReportsManagement';

// Coach Pages
import CoachDashboard from './pages/coach/CoachDashboard';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';

// Player Pages
import PlayerDashboard from './pages/player/PlayerDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/players"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <PlayersManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/coaches"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <CoachesManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/parents"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <ParentsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <PaymentsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/communications"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <CommunicationManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <ReportsManagement />
              </ProtectedRoute>
            }
          />

          {/* Coach Routes */}
          <Route
            path="/coach"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COACH]}>
                <CoachDashboard />
              </ProtectedRoute>
            }
          />

          {/* Parent Routes */}
          <Route
            path="/parent"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Player Routes */}
          <Route
            path="/player"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PLAYER]}>
                <PlayerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
