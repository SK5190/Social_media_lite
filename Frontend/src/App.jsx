import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ImageUpload from './components/ImageUpload';
import Posts from './components/Posts';
import { AuthProvider, useAuth } from './context/AuthContext';

const AuthenticatedRoutes = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const activeLinkClass = "text-blue-200 border-b-2 border-blue-200 pb-1";
  const defaultLinkClass = "hover:text-blue-200 text-lg";

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/posts" className="text-xl sm:text-2xl font-bold hover:text-blue-200">SocialLite</Link>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 items-center">
            <li>
              <Link to="/posts" className={`${defaultLinkClass} ${location.pathname === '/posts' ? activeLinkClass : ''}`}>Posts</Link>
            </li>
            <li>
              <Link to="/upload" className={`${defaultLinkClass} ${location.pathname === '/upload' ? activeLinkClass : ''}`}>Upload Image</Link>
            </li>
            <li>
              <button onClick={logout} className="hover:text-blue-200 bg-transparent border border-white rounded-md px-3 py-1 sm:px-4 sm:py-2 transition duration-300 ease-in-out hover:bg-white hover:text-blue-600 text-base sm:text-lg">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow p-4 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
        <Routes>
          <Route path="/posts" element={<Posts />} />
          <Route path="/upload" element={<ImageUpload />} />
          <Route path="*" element={<Posts />} /> {/* Default route after login */}
        </Routes>
      </main>
    </div>
  );
};

const UnauthenticatedRoutes = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/posts'); // Redirect to posts page after login
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} /> {/* Default route for unauthenticated users */}
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthStatusWrapper />
      </AuthProvider>
    </Router>
  );
}

const AuthStatusWrapper = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />;
};

export default App;
