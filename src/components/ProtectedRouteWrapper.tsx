
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';

// Simple authentication check function
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!token && !!user;
};

// Simple loading state check
const isAuthLoading = () => {
  return false; // In a real app, this would check if auth state is loading
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRouteWrapper = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const loading = isAuthLoading();

  useEffect(() => {
    if (!loading && !authenticated) {
      toast.error('Please log in to access this page');
    }
  }, [loading, authenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying your credentials...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    // Redirect to login page with the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRouteWrapper;
