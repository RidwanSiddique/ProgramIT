import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Home.css'; // Import the CSS file for styling

const Home = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/programit/allQuestions");
      setQuestions(response.data);
      console.log("Question:", questions)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home-container">
      <header>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>
        <div className="app-name">ProgramIT</div>
      </header>
      <div className="content">
  {questions.map((question) => (
    <div key={question._id} className="question-container">
      <div className="question">
        <h3>{question.questionTitle}</h3>
        <p>{question.questionBody}</p>
        <p>Created at: {question.askedOn}</p>
        <p>User: {question.userPosted}</p>
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default Home;