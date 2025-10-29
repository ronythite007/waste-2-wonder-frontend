import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import WasteUpload from './components/WasteUpload';
import Suggestions from './components/Suggestions';
import EnhancedMarketplace from './components/EnhancedMarketplace';
import EnhancedEcoTracker from './components/EnhancedEcoTracker';
import AdminPanel from './components/AdminPanel';
import Community from './components/Community';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WasteProvider } from './contexts/WasteContext';
import { MarketplaceProvider } from './contexts/MarketplaceContext';
import { CommunityProvider } from './contexts/CommunityContext';

// Smart Redirect component that waits for profile to load
function SmartRedirect({ fallback }: { fallback: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're on login or landing page
    if (!['/login', '/'].includes(location.pathname)) return;
    
    if (user && user.profile) {
      const redirectTo = user.profile.role === 'admin' ? '/admin' : '/dashboard';
      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 100);
    }
  }, [user, user?.profile, navigate, location.pathname]);

  return <Navigate to={fallback} />;
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        {user && !['/login', '/'].includes(window.location.pathname) && <Navbar />}
        {user && !['/login', '/'].includes(window.location.pathname) && (
          <div className="h-16" />
        )}
        <div className="pb-20 md:pb-0" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 5rem)' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <Landing /> : <SmartRedirect fallback="/dashboard" />} />
          <Route path="/login" element={!user ? <Login /> : <SmartRedirect fallback="/dashboard" />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <WasteUpload />
            </ProtectedRoute>
          } />
          <Route path="/suggestions" element={
            <ProtectedRoute>
              <Suggestions />
            </ProtectedRoute>
          } />
          <Route path="/marketplace" element={
            <ProtectedRoute>
              <EnhancedMarketplace />
            </ProtectedRoute>
          } />
          <Route path="/eco-tracker" element={
            <ProtectedRoute>
              <EnhancedEcoTracker />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              {user?.profile?.role === 'admin' ? <AdminPanel /> : <Navigate to="/dashboard" />}
            </ProtectedRoute>
          } />
        </Routes>
        </div>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <WasteProvider>
        <MarketplaceProvider>
          <CommunityProvider>
            <AppContent />
          </CommunityProvider>
        </MarketplaceProvider>
      </WasteProvider>
    </AuthProvider>
  );
}

export default App;