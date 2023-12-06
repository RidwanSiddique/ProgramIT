import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/authContext'; 
import axios from 'axios';
import '../styles/Questions.css';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const { questionId } = useParams();
  const [questionDetails, setQuestionDetails] = useState(null);
  const [answer, setAnswer] = useState({ title: '', body: '' });
  const { user } = useContext(AuthContext);
  useEffect(() => {
  fetchData();
  }, []);
  
  const fetchData = async () => {
  try {
  const response = await axios.get("http://localhost:8080/programit/allQuestions");
  setQuestions(response.data);
  console.log("Questions:", questions)
  } catch (error) {
  console.log(error);
  }
  };
  
  useEffect(() => {
  fetchQuestionDetails();
  }, []);
  
  const fetchQuestionDetails = async () => {
  try {
    console.log("User:", user)
  const response = await axios.get(`http://localhost:8080/programit/questionDetails/${questionId}`, {
    headers: {
      Authorization: `Bearer ${user.token}`, // Add the authorization header
    },
  });
  const { question } = response.data;
  setQuestionDetails(question);
  } catch (error) {
  console.log(error);
  }
  };
  const handleAnswerInputChange = (e) => {
    setAnswer({ ...answer, [e.target.name]: e.target.value });
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`http://localhost:8080/programit/answer/post/${questionId}`, {
        noOfAnswers: questionDetails.noOfAnswers + 1,
        answerBody: answer.body,
        userAnswered: user.username,
        userId: user.userId,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Add the authorization header
        },
      });

      setAnswer({ title: '', body: '' });
      fetchQuestionDetails(); // Refresh question details after submitting the answer
    } catch (error) {
      console.log(error);
    }
  };

  
  return (
  <div>
  {questions.map((question) => (
  <div key={question.id}>
  <h2>{question.questionTitle}</h2>
  <p>{question.questionBody}</p>
  <button onClick={() => fetchQuestionDetails(question.id)}>+</button>
  </div>
  ))}
  {questionDetails && (
        <div>
          <h3>Answer:</h3>
          <p>{questionDetails.answer}</p>
          {/* Add answer form */}
          <form onSubmit={handleAnswerSubmit}>
            <label htmlFor="answerTitle">Answer Title:</label>
            <input
              type="text"
              id="answerTitle"
              name="title"
              value={answer.title}
              onChange={handleAnswerInputChange}
            />

            <label htmlFor="answerBody">Answer Body:</label>
            <textarea
              id="answerBody"
              name="body"
              value={answer.body}
              onChange={handleAnswerInputChange}
            ></textarea>

            <button type="submit">Submit Answer</button>
          </form>
        </div>
      )}
  </div>
  );
  };
  
  export default Questions;