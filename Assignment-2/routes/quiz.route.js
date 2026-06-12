const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

router.route('/')
  .get(quizController.getAllQuizzes)
  .post(quizController.createQuiz);

router.route('/:quizId')
  .get(quizController.getQuizById)
  .put(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

router.get('/:quizId/populate', quizController.getQuizPopulateCapital);
router.post('/:quizId/question', quizController.addQuestionToQuiz);
router.post('/:quizId/questions', quizController.addMultipleQuestionsToQuiz);

module.exports = router;
