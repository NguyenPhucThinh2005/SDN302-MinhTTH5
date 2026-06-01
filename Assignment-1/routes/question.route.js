const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

router.route('/')
  .get(questionController.getAllQuestions)
  .post(questionController.createQuestion);

router.route('/:questionId')
  .get(questionController.getQuestionById)
  .put(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;
