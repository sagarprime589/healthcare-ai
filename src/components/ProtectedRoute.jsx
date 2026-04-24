import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('healthai_user') || 'null');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}