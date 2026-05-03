import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
 const { user, loading } = useContext(AuthContext);
 const location = useLocation();

 if (loading) {
 return (
 <div className="h-screen w-screen flex items-center justify-center bg-white ">
 <Loader2 size={40} className="animate-spin text-primary-600" />
 </div>
 );
 }

 // Use is_admin flag as per backend schema and user request
 if (!user || !user.is_admin) {
 return <Navigate to="/" replace />;
 }

 return children;
};

export default AdminRoute;
