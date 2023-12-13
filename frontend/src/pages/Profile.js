import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/authContext'; 
import axios from 'axios';

const Profile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [userImageUri, setUserImageUri] = useState(null);
  const { user, dispatch } = useContext(AuthContext);
  const navigation = useNavigate();
  useEffect(() => {
    // Fetch user data when the component mounts
    fetchUserData();
  });
  
  const fetchUserData = async () => {
    try {
      // Make a request to fetch user data
      const response = await axios.get(`http://localhost:8080/programit/user/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("User data response:", response.data);
      // Update the state with the fetched user data
      if (response.data.success) {
        // Update the state with the fetched user data
        const userData = response.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setUserImageUri(userData.profileImage);
      } else {
        console.error(`Failed to fetch user data. Server responded with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };
  const handleUploadProfileImage = async () => {
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
          const base64Image = event.target.result;
          setProfileImage(base64Image);
          // Make a request to the backend to update the profile image
          const formData = new FormData();
          formData.append("profileImage", base64Image);

          const config = {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
          };

          try {
            const response = await axios.post(
              `http://localhost:8080/programit/user/${user.userId}/profile-image`,
              formData,
              config
            );

            if (response.status === 200) {
              // If the update is successful, update the user's profile image locally
              setUserImageUri(base64Image);
            } else {
              console.error(
                `Failed to update profile image. Server responded with status ${response.status}`
              );
            }
          } catch (error) {
            console.error("Error updating profile image", error);
          }
        };

        reader.readAsDataURL(file);
      };

      fileInput.click();
    } catch (error) {
      console.error("Error selecting profile image", error);
    }
  };
  useEffect(() => {
    // update user data on update profile button when the component mounts
    handleSubmit();
  });
  const handleSubmit = async () => {
    // Construct the user's profile data as a JSON object
    const profileData = {
      firstName,
      lastName,
      email,
      profileImage: profileImage ? profileImage : null,
    };
  
    try {
      // Send a POST request to your server's API endpoint for updating the user profile
      const response = await axios.post(`http://localhost:8080/programit/user/updateProfile/${user.userId}`, profileData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      // Check the status code of the server's response
      if (response.data.success) {
        // If the status code indicates success, update the user's information in your app's state
        // For example, if you're using React Context for state management:
        // dispatch({ type: 'UPDATE_PROFILE', payload: profileData });
        console.log('Profile updated successfully');
      } else {
        // If the status code indicates an error, display an error message to the user
        console.log('Error in profile:', response.data.message);
      }
    } catch (error) {
      // Handle any errors that occurred when making the request
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.userImageContainer}>
        <img src={userImageUri} alt="Profile" style={styles.userImage} />
        <button onClick={handleUploadProfileImage} style={styles.changeImageIcon}>
          <FontAwesomeIcon icon={faExchange} size="lg" color="black" />
        </button>
      </div>
  
      {/* Display user information */}
      <label style={styles.inputLabel}>First Name</label>
      <input
        type="text"
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
  
      <label style={styles.inputLabel}>Last Name</label>
      <input
        type="text"
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
  
      <label style={styles.inputLabel}>Email</label>
      <input
        type="email"
        style={styles.input}
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
  
      <button style={styles.button} onClick={handleSubmit}>
        Update Profile
      </button>
    </div>
  );
};


const styles = ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  userImageContainer: {
    alignItems: 'center',
    marginBottom: 20, 
  },
  userImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  changeImageIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  userInfoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left', // Align the input labels to the left
    alignSelf: 'flex-start', // Align the input labels to the left within their container
  },
});

export default Profile;