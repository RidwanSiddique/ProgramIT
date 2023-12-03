// App.js
import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Function to handle successful sign-in
  const handleSignIn = () => {
    // Assuming your authentication logic sets the user as logged in
    setLoggedIn(true);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/home" replace /> : <SignInPage onSignIn={handleSignIn} />}
      />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<SignUpPage />} />
    </Routes>
  );
};

export default App;
