import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './components/landing'; // make sure this path is correct
import Footer from './components/footer';
import Navbar from './components/navbar';
import AuthNavbar from './components/authnavbar';
import Signup from './components/auth/signup';
import Login from './components/auth/login';
// import HomePage from './pages/HomePage'; // example page

// import ProfilePage from './pages/ProfilePage';
// import SettingsPage from './pages/SettingsPage';
// import { supabase } from './supabaseClient';
function App() {
  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   supabase.auth.getUser().then(({ data: { user } }) => {
  //     setUser(user);
  //   });
  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setUser(session?.user ?? null);
  //   });
  // }, []);

  return (
    <Router>
      {/* {user ? <AuthNavbar user={user} /> : <Navbar />} */}
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />

        {/* <Route path="/home" element={<HomePage user={user} />} />
        <Route path="/profile" element={<ProfilePage user={user} />} />
        <Route path="/settings" element={<SettingsPage user={user} />} /> */}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
