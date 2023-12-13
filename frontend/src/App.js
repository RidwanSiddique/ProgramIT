import React, { useContext } from 'react';
import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Posts from './pages/Post';
import Questions from './pages/Questions';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';
import { AuthContext } from './context/authContext'; 

const App = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/signin');
  };

  const handleSignIn = () => {
    dispatch({ type: 'LOGIN', payload: { username: 'exampleUser' } });
  };

  return (
    <div>
      {user ? (
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
            <li>
              <Link onClick={logout} to="/signin">
                Log Out
              </Link>
            </li>
          </ul>
        </nav>
      ) : (
        <nav>
          <ul>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/register">Sign Up</Link>
            </li>
          </ul>
        </nav>
      )}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <SignInPage onSignIn={handleSignIn} />}
        />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/signin" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/posts" element={user ? <Posts /> : <Navigate to="/signin" />} />
        <Route path="/questions" element={user ? <Questions /> : <Navigate to="/signin" />} />
        <Route path="/register" element={<SignUpPage />} />
      </Routes>
    </div>
  );
};

export default App;