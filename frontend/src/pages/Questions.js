import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext'; 
import '../styles/Questions.css';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [questionDetails, setQuestionDetails] = useState({});
  const { user } = useContext(AuthContext);
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/programit/allQuestion');
      setQuestions(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnswerToggle = async (index, questionId) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].showAnswers = !updatedQuestions[index].showAnswers;
    setQuestions(updatedQuestions);

    if (updatedQuestions[index].showAnswers) {
      try {
        const response = await axios.get(`http://localhost:8080/programit/questionDetails/${questionId}`);
        const answers = response.data;
        updatedQuestions[index].answers = answers;
        setQuestions(updatedQuestions);
        setQuestionDetails({ ...questionDetails, [questionId]: answers });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <h2>All Questions</h2>
      <div className="questions-container">
        {questions.map((question, index) => (
          <div key={index} className="question">
            <div className="title">{question.title}</div>
            <div className="body">{question.body}</div>
            <div className="answer-toggle" onClick={() => handleAnswerToggle(index, question._id)}>
              <i className="fas fa-reply" />
              {question.showAnswers ? 'Hide Answers' : `Show Answers (${question.answers.length})`}
            </div>
            {question.showAnswers && (
              <div className="answers-container">
                {question.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="answer">
                    <div className="answer-body">{answer.body}</div>
                    {answer.replies.map((reply, replyIndex) => (
                      <div key={replyIndex} className="reply">
                        {reply.body}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;