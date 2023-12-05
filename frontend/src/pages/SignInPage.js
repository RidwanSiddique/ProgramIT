// SiginInPage.js  
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'
import { AuthContext } from '../context/authContext'; 
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleSignIn = async () => {
    console.log('Handling sign-in...');
    try {
      
      const response = await axios.post('http://localhost:8080/programit/login', {
        email,
        password,
      });
      if (response.data.success) {
      
        const userData = {
          userId: response.data.userId,
          email: response.data.email,
          token: response.data.token,
        };
        // Store user data in AsyncStorage
        dispatch({ type: 'LOGIN', payload: userData });
        // Clear email and password fields after successful login
        setEmail('');
        setPassword('');
        Swal.fire({
          title: "Login Successful",
          text: "Welcome to ProgramIT!",
          icon: "success"
        });
        // Navigate to the main navigator
        navigate('/home');
      } else {
        // Login failed, show an error message
        Swal.fire({
          title: "Login Failed",
          text: "Invalid email or password. Please try again.",
          icon: "error"
        });
      }
    } catch (error) {
      // Handle specific errors and show appropriate alerts
      if (error.response) {
        if (error.response.status === 401) {
          // Unauthorized (wrong email or password)
          Swal.fire({
            title: "Login Failed",
            text: "Email does not exist. Sign up to create an account.",
            icon: "error"
          });
        } 
        else if (error.response.status === 408) {
          // empty email and password field.
          Swal.fire({
            title: "Login Failed",
            text: "All Fields must be filled!",
            icon: "error"
          });
        }
        
        else if (error.response.status === 405) {
          // empty password field.
          Swal.fire({
            title: "Login Failed",
            text: "Must enter a password!",
            icon: "error"
          });
        }
        else if (error.response.status === 406) {
          // empty email field.
          Swal.fire({
            title: "Login Failed",
            text: "Must enter an email!",
            icon: "error"
          });
        }
        else if (error.response.status === 407) {
          // empty email field.
          Swal.fire({
            title: "Login Failed",
            text: "Invalid email! Please enter a valid email.",
            icon: "error"
          });
        }
        else if (error.response.status === 409) {
          // empty email field.
          Swal.fire({
            title: "Login Failed",
            text: "Invalid email or password! Please try again.",
            icon: "error"
          });
          
        }
        else {
          // Other server errors
          Swal.fire({
            title: "Login Failed",
            text: "Unknown Error",
            icon: "question"
          });
          console.log('Error Response Data:', JSON.stringify(error.response.data, null, 2));
          console.log('Error Request:', JSON.stringify(error.request, null, 2));
        }
      } else if (error.request) {
        // The request was made but no response was received
        Swal.fire({
          title: "Network Error",
          text: "No response received from the server. Please check your network connection.",
          icon: "question"
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        Swal.fire({
          title: "Request Error",
          text: `Error setting up the request: ${error.message}`,
          icon: "error"
        });
      }
    }
  };
  
  // Function to handle navigation to the sign-up screen
  const handleSignUpPress = () => {
    navigate('/register');
  };

  // Function to handle form submission
  const handleSubmit = () => {
    handleSignIn();
  };

  // Render the sign-in component
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sign In</h1>
      <div style={styles.inputContainer}>
      <input
        type="text"
        placeholder="Email Address"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        style={styles.input}
      />
      </div>
      <div style={styles.inputContainer}>
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        style={styles.input}
      />
      </div>
      <div style={styles.additionalOptionsContainer}>
        <button onClick={handleSignUpPress} style={styles.additionalOptionText}>
          Don't have an account? Sign Up
        </button>
      </div>
      <button onClick={handleSubmit} style={styles.signInButton}>
        <span style={styles.buttonText}>Sign In</span>
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    textAlign: 'center',
    marginTop: '100px',
    backgroundColor: '#f0f0f0', // Set your desired background color here
    backgroundSize: 'cover', // Ensure the background covers the entire container
    backgroundPosition: 'center', // Center the background image
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  input: {
    width: '300px',
    height: '30px',
    padding: '5px',
    margin: '10px',
  },
  inputContainer: {
    marginBottom: '20px', // Add margin between input fields
  },
  signInButton: {
    background: 'linear-gradient(to right, #007BFF, #0056b3)', // Gradient color
    width: '150px',
    height: '40px',
    padding: '5px',
    margin: '10px',
    color: 'white',
    border: 'none',
    borderRadius: '5px', // Add border-radius for rounding
    cursor: 'pointer',
    transition: 'color 0.3s ease', // Add transition for smooth effect
  },
  buttonText: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  additionalOptionsContainer: {
    textAlign: 'center',
    width: '300px',
    margin: '0 auto',
  },
  additionalOptionText: {
    fontSize: '14px',
    color: 'blue',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'color 0.3s ease', // Add transition for smooth effect
  },
  additionalOptionTextHover: {
    color: 'darkblue', // Change color on hover
  },
};




export default SignIn;
