import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { fetchQuestions, createQuestion, updateQuestion, deleteQuestion, fetchQuizzes, createQuiz, updateQuiz, deleteQuiz, addQuestionToQuiz } from '../redux/quizSlice';

// Extracted to prevent React from re-mounting and losing focus on every keystroke
const QuestionForm = ({ 
  onSubmit, 
  buttonText, 
  onCancel, 
  questionText, 
  setQuestionText, 
  options, 
  handleOptionChange, 
  correctAnswerIndex, 
  setCorrectAnswerIndex 
}) => (
  <form onSubmit={onSubmit}>
    <div className="mb-3">
      <label className="form-label fw-bold">Question Text</label>
      <input type="text" className="form-control" value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="Enter the question..." required />
    </div>
    
    <div className="mb-3">
      <label className="form-label fw-bold">Options</label>
      <div className="row g-2">
        {options.map((opt, i) => (
          <div className="col-md-6" key={i}>
            <div className="input-group">
              <span className="input-group-text bg-light text-secondary">Option {i}</span>
              <input type="text" className="form-control" value={opt} onChange={e => handleOptionChange(i, e.target.value)} placeholder={`Text for option ${i}`} required />
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div className="mb-4">
      <label className="form-label fw-bold">Correct Answer (Index 0-3)</label>
      <select className="form-select" value={correctAnswerIndex} onChange={e => setCorrectAnswerIndex(e.target.value)} required>
        {options.map((_, i) => (
          <option key={i} value={i}>Option {i}</option>
        ))}
      </select>
    </div>
    
    <div className="d-flex gap-2">
      <button type="submit" className="btn btn-primary px-4">{buttonText}</button>
      {onCancel && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel Edit</button>}
    </div>
  </form>
);

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { questions, quizzes, status } = useSelector((state) => state.quiz);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('questions'); // 'questions' or 'quizzes'

  // Form state for Questions
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  // Form state for Quizzes
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [editingQuizId, setEditingQuizId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuestions());
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // --- Questions Handlers ---
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleQuestionSubmit = async (e, targetQuizId = null) => {
    e.preventDefault();
    const data = {
      text: questionText,
      options,
      correctAnswerIndex: parseInt(correctAnswerIndex)
    };

    try {
      if (targetQuizId) {
        await dispatch(addQuestionToQuiz({ quizId: targetQuizId, questionData: data })).unwrap();
        alert('Question added to quiz successfully!');
      } else if (editingQuestionId) {
        await dispatch(updateQuestion({ id: editingQuestionId, data })).unwrap();
        setEditingQuestionId(null);
        alert('Question updated successfully!');
      } else {
        await dispatch(createQuestion(data)).unwrap();
        alert('Question created successfully!');
      }

      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswerIndex(0);
    } catch (err) {
      alert(err.message || 'Operation failed. You may not have permission.');
    }
  };

  const handleQuestionEdit = (q) => {
    setEditingQuestionId(q._id);
    setQuestionText(q.text);
    setOptions(q.options);
    setCorrectAnswerIndex(q.correctAnswerIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuestionDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await dispatch(deleteQuestion(id)).unwrap();
      } catch (err) {
        alert(err.message || 'Delete failed.');
      }
    }
  };

  // --- Quiz Handlers ---
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    const data = { title: quizTitle, description: quizDescription };

    try {
      if (editingQuizId) {
        await dispatch(updateQuiz({ id: editingQuizId, data })).unwrap();
        setEditingQuizId(null);
        alert('Quiz updated successfully!');
      } else {
        await dispatch(createQuiz(data)).unwrap();
        alert('Quiz created successfully!');
      }

      setQuizTitle('');
      setQuizDescription('');
    } catch (err) {
      alert(err.message || 'Operation failed. You may not be the author of this quiz.');
    }
  };

  const handleQuizEdit = (q) => {
    setEditingQuizId(q._id);
    setQuizTitle(q.title);
    setQuizDescription(q.description);
    
    // Also reset any question form open in the edit quiz view
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswerIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await dispatch(deleteQuiz(id)).unwrap();
        if (editingQuizId === id) setEditingQuizId(null);
      } catch (err) {
        alert(err.message || 'Delete failed. You may not be the author of this quiz.');
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3">
        <h2>Admin Dashboard</h2>
        <div>Welcome, {user?.username}</div>
      </div>
      
      {/* Navigation Menu */}
      <div className="bg-light p-2 mb-4">
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link text-secondary" to="/admin">Home</Link>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link btn btn-link ${activeTab === 'questions' ? 'text-primary fw-bold' : 'text-secondary'} text-decoration-none`} 
              onClick={() => setActiveTab('questions')}
            >
              Manage Questions
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link btn btn-link ${activeTab === 'quizzes' ? 'text-primary fw-bold' : 'text-secondary'} text-decoration-none`} 
              onClick={() => setActiveTab('quizzes')}
            >
              Manage Quizzes
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-link text-secondary text-decoration-none" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>

      <div className="container pb-5">
        
        {/* --- QUESTIONS TAB --- */}
        {activeTab === 'questions' && (
          <div>
            <h4>Questions</h4>
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-white fw-bold">{editingQuestionId ? 'Update Question' : 'Add New Question'}</div>
              <div className="card-body">
                <QuestionForm 
                  onSubmit={(e) => handleQuestionSubmit(e)} 
                  buttonText={editingQuestionId ? 'Update Question' : 'Add Question'} 
                  onCancel={editingQuestionId ? () => {
                    setEditingQuestionId(null);
                    setQuestionText('');
                    setOptions(['', '', '', '']);
                    setCorrectAnswerIndex(0);
                  } : null}
                  questionText={questionText}
                  setQuestionText={setQuestionText}
                  options={options}
                  handleOptionChange={handleOptionChange}
                  correctAnswerIndex={correctAnswerIndex}
                  setCorrectAnswerIndex={setCorrectAnswerIndex}
                />
              </div>
            </div>

            {status === 'loading' && <div className="text-muted">Loading questions...</div>}
            {questions.map((q) => (
              <div className="card mb-3 shadow-sm" key={q._id}>
                <div className="card-body">
                  <h5 className="card-title text-primary">{q.text}</h5>
                  <ul className="list-group list-group-flush mb-3">
                    {q.options.map((opt, i) => (
                      <li key={i} className={`list-group-item ${i === q.correctAnswerIndex ? "list-group-item-success fw-bold" : ""}`}>
                        {i === q.correctAnswerIndex ? '✓ ' : ''}{opt}
                      </li>
                    ))}
                  </ul>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleQuestionEdit(q)}>Edit</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleQuestionDelete(q._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- QUIZZES TAB --- */}
        {activeTab === 'quizzes' && !editingQuizId && (
          <div>
            <h4>Quizzes</h4>
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-white fw-bold">Add New Quiz</div>
              <div className="card-body">
                <form onSubmit={handleQuizSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Quiz Title</label>
                    <input type="text" className="form-control" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} placeholder="e.g., General Knowledge" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea className="form-control" rows="3" value={quizDescription} onChange={e => setQuizDescription(e.target.value)} placeholder="A short description of this quiz..." required />
                  </div>
                  <button type="submit" className="btn btn-primary px-4">Create Quiz</button>
                </form>
              </div>
            </div>

            {status === 'loading' && <div className="text-muted">Loading quizzes...</div>}
            <div className="row">
              {quizzes.map((q) => (
                <div className="col-md-6 mb-4" key={q._id}>
                  <div className="card h-100 shadow-sm border-0 bg-light">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title text-primary">{q.title}</h5>
                      <p className="card-text text-muted flex-grow-1">{q.description}</p>
                      <div className="mb-3">
                        <span className="badge bg-secondary">{q.questions?.length || 0} Questions</span>
                      </div>
                      <div className="d-flex gap-2 mt-auto">
                        <button className="btn btn-outline-primary btn-sm flex-grow-1" onClick={() => handleQuizEdit(q)}>Manage / Edit Quiz</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleQuizDelete(q._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- EDIT QUIZ VIEW (When a quiz is selected for editing) --- */}
        {activeTab === 'quizzes' && editingQuizId && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
              <div>
                <h4 className="mb-0 text-primary">Manage Quiz: {quizTitle}</h4>
                <small className="text-muted">Add or manage questions for this specific quiz.</small>
              </div>
              <button className="btn btn-outline-secondary" onClick={() => setEditingQuizId(null)}>&larr; Back to Quizzes</button>
            </div>
            
            <div className="row">
              <div className="col-lg-5">
                {/* Edit Quiz Details Form */}
                <div className="card mb-4 shadow-sm border-0 bg-light">
                  <div className="card-header bg-transparent border-0 pt-3 pb-0 fw-bold">Update Quiz Info</div>
                  <div className="card-body">
                    <form onSubmit={handleQuizSubmit}>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Title</label>
                        <input type="text" className="form-control" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-muted small mb-1">Description</label>
                        <textarea className="form-control" rows="4" value={quizDescription} onChange={e => setQuizDescription(e.target.value)} required />
                      </div>
                      <button type="submit" className="btn btn-primary w-100">Save Changes</button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                {/* Add Question to this Quiz Form */}
                <div className="card mb-4 shadow-sm border-primary">
                  <div className="card-header bg-primary text-white fw-bold">Add Question to this Quiz</div>
                  <div className="card-body">
                    <QuestionForm 
                      onSubmit={(e) => handleQuestionSubmit(e, editingQuizId)} 
                      buttonText="Create & Add to Quiz" 
                      questionText={questionText}
                      setQuestionText={setQuestionText}
                      options={options}
                      handleOptionChange={handleOptionChange}
                      correctAnswerIndex={correctAnswerIndex}
                      setCorrectAnswerIndex={setCorrectAnswerIndex}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Existing Questions in this Quiz */}
            <div className="mt-2">
              <h5 className="mb-3 border-bottom pb-2">Questions in this Quiz</h5>
              {(() => {
                const currentQuiz = quizzes.find(q => q._id === editingQuizId);
                if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
                  return <div className="alert alert-light text-center border text-muted py-4">No questions added to this quiz yet.</div>;
                }
                return (
                  <div className="row g-3">
                    {currentQuiz.questions.map((q, index) => (
                      <div className="col-md-6" key={q._id || Math.random()}>
                        <div className="card h-100 shadow-sm">
                          <div className="card-body">
                            <h6 className="card-subtitle mb-2 text-muted">Question {index + 1}</h6>
                            <p className="card-text fw-bold">{q.text}</p>
                            <ul className="list-unstyled mb-0 small">
                              {q.options?.map((opt, i) => (
                                <li key={i} className={i === q.correctAnswerIndex ? "text-success fw-bold" : "text-muted"}>
                                  {i === q.correctAnswerIndex ? '✓ ' : '- '}{opt}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
