import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
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
        <Route path="/test" element={<TestAPI />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;