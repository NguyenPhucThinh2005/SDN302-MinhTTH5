const express = require('express');
const router = express.Router();
const axios = require('axios');

// Configure axios instance for backend API
const api = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:3000'
});

// GET list of quizzes
router.get('/', async (req, res) => {
    try {
        const response = await api.get('/quizzes');
        // Render using EJS view: list.ejs inside views/quiz/
        res.render('quiz/list.ejs', { quizzes: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading quizzes');
    }
});

// GET display create quiz form
router.get('/create', (req, res) => {
    res.render('quiz/create.ejs');
});

// POST create new quiz
router.post('/', async (req, res) => {
    try {
        await api.post('/quizzes', req.body);
        res.redirect('/quizzes');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating quiz');
    }
});

// GET quiz details
router.get('/:id', async (req, res) => {
    try {
        const response = await api.get(`/quizzes/${req.params.id}`);
        res.render('quiz/details.ejs', { quiz: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading quiz details');
    }
});

// GET display edit quiz form
router.get('/:id/edit', async (req, res) => {
    try {
        const response = await api.get(`/quizzes/${req.params.id}`);
        res.render('quiz/edit.ejs', { quiz: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading quiz to edit');
    }
});

// PUT (or POST from form) update quiz
router.put('/:id', async (req, res) => {
    try {
        await api.put(`/quizzes/${req.params.id}`, req.body);
        res.redirect('/quizzes');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating quiz');
    }
});

// DELETE delete quiz
router.delete('/:id', async (req, res) => {
    try {
        await api.delete(`/quizzes/${req.params.id}`);
        res.redirect('/quizzes');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting quiz');
    }
});

// GET display create question form inside a quiz
router.get('/:id/questions/create', async (req, res) => {
    try {
        // Option 1: Just pass the quizId to the form
        // Option 2: Get quiz details to show title in the form
        const response = await api.get(`/quizzes/${req.params.id}`);
        res.render('quiz/create_question.ejs', { quiz: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading quiz for adding question');
    }
});

// POST create new question inside a quiz
router.post('/:id/questions', async (req, res) => {
    try {
        const payload = {
            ...req.body,
            options: typeof req.body.options === 'string' ? req.body.options.split(',').map(o => o.trim()) : req.body.options,
            keywords: req.body.keywords ? (typeof req.body.keywords === 'string' ? req.body.keywords.split(',').map(k => k.trim()) : req.body.keywords) : []
        };
        // The backend API is POST /quizzes/:quizId/question
        await api.post(`/quizzes/${req.params.id}/question`, payload);
        res.redirect(`/quizzes/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding question to quiz');
    }
});

module.exports = router;
