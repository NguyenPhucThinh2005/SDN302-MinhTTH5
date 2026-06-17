require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const quizRoutes = require('./routes/quiz.route');
const questionRoutes = require('./routes/question.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/user.route');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/SimpleQuiz')
  .then(() => console.log('Connected to MongoDB: SimpleQuiz'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/users', userRoutes);
app.use('/quizzes', quizRoutes);
app.use('/question', questionRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    success: false,
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
