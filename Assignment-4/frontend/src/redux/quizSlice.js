import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// --- Quizzes ---
export const fetchQuizzes = createAsyncThunk('quiz/fetchQuizzes', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/quizzes');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createQuiz = createAsyncThunk('quiz/createQuiz', async (quizData, { rejectWithValue }) => {
  try {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateQuiz = createAsyncThunk('quiz/updateQuiz', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/quizzes/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteQuiz = createAsyncThunk('quiz/deleteQuiz', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/quizzes/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addQuestionToQuiz = createAsyncThunk('quiz/addQuestionToQuiz', async ({ quizId, questionData }, { rejectWithValue }) => {
  try {
    const response = await api.post(`/quizzes/${quizId}/question`, questionData);
    return { quizId, question: response.data };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// --- Questions ---
export const fetchQuestions = createAsyncThunk('quiz/fetchQuestions', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/question');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createQuestion = createAsyncThunk('quiz/createQuestion', async (questionData, { rejectWithValue }) => {
  try {
    const response = await api.post('/question', questionData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateQuestion = createAsyncThunk('quiz/updateQuestion', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/question/${id}`, data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteQuestion = createAsyncThunk('quiz/deleteQuestion', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/question/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    quizzes: [],
    questions: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload);
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        const index = state.quizzes.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          // preserve questions array if not returned fully populated
          state.quizzes[index] = { ...state.quizzes[index], ...action.payload };
        }
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(q => q._id !== action.payload);
      })
      .addCase(addQuestionToQuiz.fulfilled, (state, action) => {
        const quizIndex = state.quizzes.findIndex(q => q._id === action.payload.quizId);
        if (quizIndex !== -1) {
          state.quizzes[quizIndex].questions.push(action.payload.question);
        }
        state.questions.push(action.payload.question); // Also add to local questions list
      })
      
      // Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Create Question
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload);
      })
      // Update Question
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      // Delete Question
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(q => q._id !== action.payload);
      });
  },
});

export default quizSlice.reducer;
