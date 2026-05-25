import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Auth pages
import StudentAuth from './pages/auth/StudentAuth';
import TpoAuth from './pages/auth/TpoAuth';

// Student pages
import Landing from './pages/Landing';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Checkin from './pages/Checkin';
import Companies from './pages/Companies';
import Drives from './pages/Drives';
import Notifications from './pages/Notifications';

// TPO pages
import TpoDashboard from './pages/tpo/TpoDashboard';
import PostDrive from './pages/tpo/PostDrive';
import DriveDetails from './pages/tpo/DriveDetails';
import StudentProfile from './pages/tpo/StudentProfile';
import BatchAnalytics from './pages/tpo/BatchAnalytics';

function ProtectedRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to={role === 'tpo' ? '/auth/tpo' : '/auth/student'} />;
  if (role && user?.userType !== role) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-mesh text-slate-800 selection:bg-indigo-500/20">
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/student" element={<StudentAuth />} />
        <Route path="/auth/tpo" element={<TpoAuth />} />

        {/* Student */}
        <Route path="/setup" element={<ProtectedRoute role="student"><Setup /></ProtectedRoute>} />
        <Route path="/dashboard/:studentId" element={<ProtectedRoute role="student"><Dashboard /></ProtectedRoute>} />
        <Route path="/checkin/:studentId" element={<ProtectedRoute role="student"><Checkin /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute role="student"><Companies /></ProtectedRoute>} />
        <Route path="/drives" element={<ProtectedRoute role="student"><Drives /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute role="student"><Notifications /></ProtectedRoute>} />

        {/* TPO */}
        <Route path="/tpo/dashboard" element={<ProtectedRoute role="tpo"><TpoDashboard /></ProtectedRoute>} />
        <Route path="/tpo/analytics" element={<ProtectedRoute role="tpo"><BatchAnalytics /></ProtectedRoute>} />
        <Route path="/tpo/drives/new" element={<ProtectedRoute role="tpo"><PostDrive /></ProtectedRoute>} />
        <Route path="/tpo/drives/:driveId" element={<ProtectedRoute role="tpo"><DriveDetails /></ProtectedRoute>} />
        <Route path="/tpo/students/:studentId" element={<ProtectedRoute role="tpo"><StudentProfile /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}
