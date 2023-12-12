import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/authContext'; 
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
      console.log("Questions:", questions);
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
      await axios.patch(`http://localhost:8080/programit/post/${questionId}`, {
        noOfAnswers: questionDetails.noOfAnswers + 1,
        answerBody: answer.body,
        userAnswered: user.username,
        userId: user.userId,
      });

      setAnswer({ title: '', body: '' });
      // fetchQuestionDetails(); // No need to fetch question details after submitting the answer
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="questions-container">
      {questions.map((question) => (
        <div className="question" key={question.id}>
          <div className="title-container">
            <h2>{question.questionTitle}</h2>
          </div>
          <div className="body-container">
            <p>{question.questionBody}</p>
          </div>
          {/* <button onClick={() => fetchQuestionDetails(question.id)}>+</button> */}
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