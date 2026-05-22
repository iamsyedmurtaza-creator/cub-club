import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
export default function ProtectedAdminRoute() {
  const { loading, user, isAdmin } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-cream p-6"><div className="card-soft max-w-sm p-8 text-center"><div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cocoa/10 border-t-cocoa" /><p className="mt-4 font-display text-xl font-bold text-cocoa">Checking admin access...</p></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}
