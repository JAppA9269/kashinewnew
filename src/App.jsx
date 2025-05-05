import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing';
import Footer from './components/footer';
import Navbar from './components/navbar';
import AuthNavbar from './components/authnavbar';
import Signup from './components/auth/signup';
import Login from './components/auth/login';
import Main from './components/main';
import Profile from './components/profile';
import Sell from './components/sell';
import ParentComponent from './components/ParentComponent';
import ProductPage from './components/ProductPage';
import PublicProfile from './components/PublicProfile'; // ✅ NEW
import { useUser } from './UserContext';
import { supabase } from './components/auth/supabaseClient';

function App() {
  const { user, loading } = useUser();

  return (
    <Router>
      {user ? <AuthNavbar /> : <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/signup"
          element={
            loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : user ? (
              <Navigate to="/main" replace />
            ) : (
              <Signup />
            )
          }
        />

        <Route
          path="/login"
          element={
            loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : user ? (
              <Navigate to="/main" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/main"
          element={
            loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : user ? (
              <Main />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/profile"
          element={
            loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : user ? (
              <Profile />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/sell"
          element={
            loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : user ? (
              <Sell />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/profile/:username" element={<PublicProfile />} /> {/* ✅ NEW */}
        <Route path="/test-editor" element={<ParentComponent />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
