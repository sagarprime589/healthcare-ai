import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Diagnosis from './pages/Diagnosis';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import TestAPI from './pages/TestAPI';
import Chat from './pages/Chat';
import History from './pages/History';
import BodyMap from './pages/BodyMap';
import MedicineLookup from './pages/MedicineLookup';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import VitalSigns from './pages/VitalSigns';
import Appointments from './pages/Appointments';
import NotFound from './pages/NotFound';
import RockyChat from './components/RockyChat';

function AppContent() {
  const location = useLocation();
  const hideRocky = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/diagnosis" element={<ProtectedRoute><Diagnosis /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/bodymap" element={<ProtectedRoute><BodyMap /></ProtectedRoute>} />
        <Route path="/medicine" element={<ProtectedRoute><MedicineLookup /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/vitals" element={<ProtectedRoute><VitalSigns /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/test" element={<TestAPI />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideRocky && <RockyChat />}
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
