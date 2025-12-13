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
import CoachAttendance from './pages/coach/CoachAttendance';
import CoachRoster from './pages/coach/CoachRoster';
import CoachPerformance from './pages/coach/CoachPerformance';
import CoachSchedule from './pages/coach/CoachSchedule';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentAttendance from './pages/parent/ParentAttendance';
import ParentProgress from './pages/parent/ParentProgress';
import ParentPayments from './pages/parent/ParentPayments';
import ParentAnnouncements from './pages/parent/ParentAnnouncements';
import ParentSchedule from './pages/parent/ParentSchedule';

// Player Pages
import PlayerDashboard from './pages/player/PlayerDashboard';
import PlayerAttendance from './pages/player/PlayerAttendance';
import PlayerProgress from './pages/player/PlayerProgress';
import PlayerSchedule from './pages/player/PlayerSchedule';

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
          <Route
            path="/coach/attendance"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COACH]}>
                <CoachAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach/roster"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COACH]}>
                <CoachRoster />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach/performance"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COACH]}>
                <CoachPerformance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach/schedule"
            element={
              <ProtectedRoute allowedRoles={[ROLES.COACH]}>
                <CoachSchedule />
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
          <Route
            path="/parent/attendance"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
                <ParentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/progress"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
                <ParentProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/payments"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
                <ParentPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/announcements"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
                <ParentAnnouncements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/schedule"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PARENT]}>
                <ParentSchedule />
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
          <Route
            path="/player/attendance"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PLAYER]}>
                <PlayerAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/player/progress"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PLAYER]}>
                <PlayerProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/player/schedule"
            element={
              <ProtectedRoute allowedRoles={[ROLES.PLAYER]}>
                <PlayerSchedule />
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
