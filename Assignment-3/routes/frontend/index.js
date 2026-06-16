const express = require('express');
const router = express.Router();

const quizRoutes = require('./quiz');
const questionRoutes = require('./question');

// Trang chủ hiển thị bằng index.ejs
router.get('/', (req, res) => {
    res.render('index.ejs', { title: 'Question Bank Management' });
});

router.use('/quizzes', quizRoutes);
router.use('/questions', questionRoutes);

module.exports = router;
