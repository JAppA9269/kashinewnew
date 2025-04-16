import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landing';
import Footer from './components/footer';
import Navbar from './components/navbar';
import AuthNavbar from './components/authnavbar';
import Signup from './components/auth/signup';
import Login from './components/auth/login';
import Mainpage from './components/mainpage';
import Profile from './components/profile';
import Sell from './components/sell'; // ✅ Added Sell page
import { useUser } from './UserContext';
import { supabase } from './components/auth/supabaseClient';

function App() {
  const { user, loading } = useUser();

  return (
    <Router>
      {/* ✅ Show the correct navbar */}
      {user ? <AuthNavbar /> : <Navbar />}

      <Routes>
        {/* Public route */}
        <Route path="/" element={<LandingPage />} />

        {/* Redirect logged-in users away from signup/login */}
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

        {/* Protected main page */}
        <Route
          path="/main"
          element={
            loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : user ? (
              <Mainpage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected profile page */}
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

        {/* ✅ Protected sell page */}
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
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
