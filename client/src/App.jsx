import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Documentation from './pages/Documentation';
import Unauthorized from './pages/Unauthorized';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, [token]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#f6f8fa]">
        <Navbar user={user} logout={logout} />
        <div className="max-w-5xl mx-auto px-6 py-10">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/profile" element={
              user ? <Profile user={user} token={token} setUser={setUser} /> : <Navigate to="/login" />
            } />
            <Route path="/admin" element={
              user && user.isAdmin ? <Admin token={token} /> : <Unauthorized />
            } />
            <Route path="/documentation" element={
              <Documentation user={user} />
            } />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;