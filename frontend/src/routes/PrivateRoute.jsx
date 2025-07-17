import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ allowedRoles }) {
    const { auth } = useAuth();

    if (!auth?.token) return <Navigate to="/login" replace />;

    const userRole = auth.user.role;

    if (!allowedRoles.includes(userRole)) {
        // Redirect based on actual user role
        if (userRole === 'admin' || userRole === 'superadmin') {
            return <Navigate to="/dashboard" replace />;
        } else if (userRole === 'user') {
            return <Navigate to="/my-submissions" replace />;
        } else {
            return <div className="p-10 text-center text-red-600 text-xl">403 - Forbidden</div>;
        }
    }

    return <Outlet />;
}
