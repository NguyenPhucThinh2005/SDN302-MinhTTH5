import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzes } from '../redux/quizSlice';

const QuizView = () => {
  const dispatch = useDispatch();
  const { quizzes, status } = useSelector((state) => state.quiz);
  
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    // Check if correct
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswerIndex) {
      setScore(score + 1);
    }

    // Move to next question or complete
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
  };

  if (status === 'loading') return <div className="text-center mt-5">Loading...</div>;

  // STEP 1: Quiz Selection List
  if (!selectedQuiz) {
    return (
      <div className="container mt-4">
        <h3 className="mb-4">Select a Quiz</h3>
        {quizzes.length === 0 ? (
          <div className="alert alert-info">No quizzes available in the database.</div>
        ) : (
          <div className="row">
            {quizzes.map((quiz) => (
              <div className="col-md-4 mb-4" key={quiz._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary">{quiz.title}</h5>
                    <p className="card-text text-muted flex-grow-1">{quiz.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="badge bg-secondary">{quiz.questions.length} questions</span>
                      <button 
                        className="btn btn-outline-primary btn-sm" 
                        onClick={() => handleStartQuiz(quiz)}
                        disabled={quiz.questions.length === 0}
                      >
                        Start Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // STEP 2: Quiz taking UI
  if (quizCompleted) {
    return (
      <div className="text-center mt-5">
        <h2>Quiz Completed</h2>
        <p className="mt-3 fs-5">Your score: <strong>{score}</strong> / {selectedQuiz.questions.length}</p>
        <div className="mt-4">
          <button className="btn btn-primary me-3" onClick={handleRestart}>Restart Quiz</button>
          <button className="btn btn-outline-secondary" onClick={handleBackToList}>Back to Quizzes</button>
        </div>
      </div>
    );
  }

  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];

  return (
    <div className="d-flex flex-column align-items-center mt-5">
      <div className="w-100 d-flex justify-content-between align-items-center mb-2 px-5">
        <button className="btn btn-sm btn-link text-decoration-none" onClick={handleBackToList}>&larr; Back to Quizzes</button>
        <span className="text-muted small">Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}</span>
      </div>
      
      <h2>{selectedQuiz.title}</h2>
      <h4 className="mt-3 mb-4 text-center" style={{ maxWidth: '600px' }}>{currentQuestion.text}</h4>
      
      <div className="text-start" style={{ width: '400px' }}>
        {currentQuestion.options.map((option, index) => (
          <div 
            className="form-check mb-3 p-3 border rounded position-relative d-flex align-items-center" 
            key={index} 
            style={{ 
              cursor: 'pointer', 
              backgroundColor: selectedOption === index ? '#f0f8ff' : 'white',
              borderColor: selectedOption === index ? '#0d6efd' : '#dee2e6'
            }}
          >
            <input 
              className="form-check-input m-0 me-3" 
              type="radio" 
              name={`quizOption-${currentQuestionIndex}`} 
              id={`option-${currentQuestionIndex}-${index}`}
              checked={selectedOption === index}
              onChange={() => handleOptionSelect(index)}
              style={{ cursor: 'pointer' }}
            />
            <label 
              className="form-check-label stretched-link mb-0" 
              htmlFor={`option-${currentQuestionIndex}-${index}`} 
              style={{ cursor: 'pointer' }}
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      
      <button 
        className="btn btn-primary mt-4 px-4 py-2" 
        onClick={handleSubmit}
        disabled={selectedOption === null}
      >
        Submit Answer
      </button>
    </div>
  );
};

export default QuizView;
