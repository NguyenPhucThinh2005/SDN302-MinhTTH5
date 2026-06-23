const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const authenticate = require('../authenticate');

router.route('/')
  .get(quizController.getAllQuizzes)
  .post(authenticate.verifyUser, authenticate.verifyAdmin, quizController.createQuiz);

router.route('/:quizId')
  .get(quizController.getQuizById)
  .put(authenticate.verifyUser, authenticate.verifyAdmin, authenticate.verifyQuizAuthor, quizController.updateQuiz)
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, authenticate.verifyQuizAuthor, quizController.deleteQuiz);

router.get('/:quizId/populate', quizController.getQuizPopulateCapital);
router.post('/:quizId/question', authenticate.verifyUser, authenticate.verifyAdmin, authenticate.verifyQuizAuthor, quizController.addQuestionToQuiz);
router.post('/:quizId/questions', authenticate.verifyUser, authenticate.verifyAdmin, authenticate.verifyQuizAuthor, quizController.addMultipleQuestionsToQuiz);

module.exports = router;
