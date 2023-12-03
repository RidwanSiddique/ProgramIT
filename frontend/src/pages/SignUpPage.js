import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const { dispatch } = useContext(AuthContext);

  const handleSignUp = async () => {
    console.log('Handling sign-up...');
    try {
      const response = await axios.post('http://localhost:8080/programit/register', {
        firstName,
        lastName,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.message === 'passed') {
        // Registration successful, dispatch LOGIN action
        dispatch({ type: 'LOGIN', payload: { token: response.data.token } });

        alert('Registration Successful','Please Sign In now!');
        // Navigate to a different screen (e.g., Home)
        navigate('/');
      } else {
        // registration failed, show an error message
        alert('Login Failed', 'Please try again.');
      }
    } catch (error) {
      // Handle specific errors and show appropriate alerts
      if (error.response) {
        if (error.response.status === 401) {
          // Unauthorized (wrong email or password)
          alert('Sign Up Failed', 'Email already exists. Please Sign In!');

          navigate('/');
        } 
        else if (error.response.status === 400) {
          // empty email and password field.
          alert('Sign Up Failed', 'All Fields must be filled!');
        }
        else if (error.response.status === 405) {
          // empty password field.
          alert('Sign Up Failed', 'Must enter a password!');
        }
        else if (error.response.status === 406) {
          // empty email field.
          alert('Sign Up Failed', 'Must enter an email!');
        }
        else if (error.response.status === 407) {
          // empty email field.
          alert('Sign Up Failed', 'Invalid email! Please enter a valid email.');
        }
        else {
          // Other server errors
          alert('Server Error', `Server responded with an error: ${error.response.data}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        alert('Network Error', 'No response received from the server. Please check your network connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Request Error', `Error setting up the request: ${error.message}`);
      }
  
      console.error('Error:', error);
    }
  };


  const handleSignInPress = () => {
    navigate('/');
  };

  const handleSubmit = () => {
    // You can add form validation logic here if needed
    console.log({
      firstName,
      lastName,
      email,
      password,
    });

    // Call your signUp function here
    handleSignUp();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sign Up</h1>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button style={styles.button} onClick={handleSubmit}>
        <span style={styles.buttonText}>Sign Up</span>
      </button>
      <div style={styles.additionalOptionsContainer}>
        <button onClick={handleSignInPress} style={styles.additionalOptionText}>
          Already have an account? Sign In
        </button>
      </div>
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
    backgroundImage: 'url(/background.png)', // Set your background image if needed
    backgroundSize: 'cover', // Ensure the background covers the entire container
    backgroundPosition: 'center', // Center the background image
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  inputContainer: {
    marginBottom: '20px',
  },
  input: {
    width: '300px',
    height: '30px',
    padding: '5px',
    margin: '10px',
  },
  button: {
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
  buttonHover: {
    backgroundColor: 'darkblue', // Change color on hover
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



export default SignUp;