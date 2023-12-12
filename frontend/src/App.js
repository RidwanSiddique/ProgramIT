import React, { useState } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile'; 
import Posts from './pages/Post'
import Questions from './pages/Questions';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';
const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Function to handle successful sign-in
  const handleSignIn = () => {
    // Assuming your authentication logic sets the user as logged in
    setLoggedIn(true);
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/questions">Questions</Link>
          </li>
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" replace /> : <SignInPage onSignIn={handleSignIn} />}
        />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/register" element={<SignUpPage />} />
      </Routes>
    </div>
  );
};

export default App;