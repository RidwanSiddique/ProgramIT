import { createContext, useReducer, useEffect } from 'react';

export const QuestionContext = createContext();

export const questionReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_QUESTION':
      return { questions: [...state.questions, action.payload] };
    case 'DELETE_QUESTION':
      return {
        questions: state.questions.filter(
          (question) => question.id !== action.payload
        ),
      };
    case 'UPDATE_QUESTION':
      return {
        questions: state.questions.map((question) =>
          question.id === action.payload.id ? action.payload : question
        ),
      };
    default:
      return state || { questions: [] };
  }
};

export const QuestionContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(questionReducer, {
    questions: [],
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch questions from your API or database
        const quesJson = window.localStorage.getItem('question');
        // console.log('User from localStorage:', userJson); // For debugging purposes
        if (quesJson) {
            const question = JSON.parse(quesJson);
        // Set the fetched questions to the state
        dispatch({ type: 'ADD_QUESTION', payload: question.questions });
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <QuestionContext.Provider value={{ ...state, dispatch }}>
      {children}
    </QuestionContext.Provider>
  );
};