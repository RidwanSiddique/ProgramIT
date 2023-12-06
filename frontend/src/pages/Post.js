import React, { useState, useEffect, useContext } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { AuthContext } from '../context/authContext'; 
import axios from 'axios';

const CreatePost = () => {
  const [question, setQuestion] = useState({ title: "", body: "" });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // Add file preview state
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/programit/allQuestions");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Create a file preview URL
    const filePreviewUrl = URL.createObjectURL(selectedFile);
    setFilePreview(filePreviewUrl);
  };
    
    const handlePost = async (e) => {
      e.preventDefault();
    
      const formData = new FormData();
      formData.append("file", file);
      formData.append("questionTitle", question.title);
      formData.append("questionBody", question.body);
    
      try {
        await axios.post(`http://localhost:8080/programit/askQuestion/${user.userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`, // Add the authorization header
          },
        });
        console.log('Question posted:', question);
        console.log('File uploaded:', file);
        setQuestion({ title: '', body: '' });
        setFile(null);
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2>Create Post</h2>
        <form onSubmit={handlePost}>
          <label htmlFor="questionTitle">Question Title:</label>
          <input
            type="text"
            id="questionTitle"
            name="title"
            value={question.title}
            onChange={handleInputChange}
            style={styles.input}
            required
          />

          <label htmlFor="questionBody">Question Body:</label>
          <textarea
            id="questionBody"
            name="body"
            value={question.body}
            onChange={handleInputChange}
            style={styles.textarea}
            required
          />

          <div style={styles.fileUploadContainer}>
            <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <label htmlFor="fileUpload" style={styles.fileUploadLabel}>
            <AiOutlineCloudUpload style={styles.fileUploadIcon} />
                Upload File
            </label>
            </div>
            {file && file.type && (
            <div>
                {file.type.includes('image') ? (
                <img src={filePreview} alt="File Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                ) : (
                <video src={filePreview} controls style={{ maxWidth: '100%', maxHeight: '200px' }} />
                )}
            </div>
)}
          <button type="submit" style={styles.button}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '70%',
    margin: '0 auto',
  },
  form: {
    width: '100%',
    padding: '20px',
    borderRadius: '5px',
    backgroundColor: '#f2f2f2',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  fileUploadContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  fileUploadLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '200px',
    height: '40px',
    margin: '0 auto',
    borderRadius: '5px',
    border: '1px dashed #ccc',
    cursor: 'pointer',
  },
  fileUploadIcon: {
    marginRight: '5px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  buttonHover: {
    backgroundColor: '#0062cc',
  },
};

export default CreatePost;