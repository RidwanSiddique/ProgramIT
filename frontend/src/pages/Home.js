import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../styles/Home.css'; // Import the CSS file for styling

const Home = () => {
const [searchExpanded, setSearchExpanded] = useState(false);
const [selectedQuestion, setSelectedQuestion] = useState(null);

    // Mock data for questions
    const questions = [
        { id: 1, title: 'Question 1', answers: ['Answer 1', 'Answer 2'] },
        { id: 2, title: 'Question 2', answers: ['Answer 3', 'Answer 4'] },
        // ... More questions
    ];

    const handleSearchClick = () => {
        setSearchExpanded(!searchExpanded);
    };

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
    };

    return (
        <div className="home-container">
        <header>
            <div className="search-bar">
            <input
                type="text"
                placeholder="Search"
                className={`search-input ${searchExpanded ? 'expanded' : ''}`}
            />
            <FaSearch className="search-icon" onClick={handleSearchClick} />
            </div>
            <nav>
            <ul className="navigation-tabs">
                <li>Home</li>
                <li>Questions</li>
                <li>Profile</li>
                {/* Add more navigation tabs */}
            </ul>
            </nav>
            <div className="app-name">ProgramIT</div>
        </header>
        <div className="content">
            <div className="questions-sidebar">
            {questions.map((question) => (
                <div
                key={question.id}
                className={`question ${selectedQuestion === question ? 'selected' : ''}`}
                onClick={() => handleQuestionClick(question)}
                >
                {question.title}
                </div>
            ))}
            </div>
            <div className="main-body">
            {selectedQuestion ? (
                <div>
                <h2>{selectedQuestion.title}</h2>
                <ul>
                    {selectedQuestion.answers.map((answer, index) => (
                    <li key={index}>{answer}</li>
                    ))}
                </ul>
                </div>
            ) : (
                <div className="default-message">Click on a question to view its details</div>
            )}
            </div>
        </div>
        </div>
    );
    };

    export default Home;