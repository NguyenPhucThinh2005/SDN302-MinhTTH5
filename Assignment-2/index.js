const express = require('express');
const mongoose = require('mongoose');

const quizRoutes = require('./routes/quiz.route');
const questionRoutes = require('./routes/question.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/SimpleQuiz')
  .then(() => console.log('Connected to MongoDB: SimpleQuiz'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/quizzes', quizRoutes);
app.use('/question', questionRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
