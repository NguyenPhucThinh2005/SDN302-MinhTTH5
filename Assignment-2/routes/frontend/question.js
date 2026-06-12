const express = require('express');
const router = express.Router();
const axios = require('axios');

const api = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:3000'
});

// Note: Backend assignment 1 has the route as '/question'
const apiBasePath = '/question';

// GET list of questions
router.get('/', async (req, res) => {
    try {
        const response = await api.get(apiBasePath);
        res.render('questions/list.ejs', { questions: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading questions');
    }
});

// GET display create question form
router.get('/create', (req, res) => {
    res.render('questions/create.ejs');
});

// POST create new question
router.post('/', async (req, res) => {
    try {
        // Options usually come as a comma-separated string, convert to array if needed
        const payload = {
            ...req.body,
            options: typeof req.body.options === 'string' ? req.body.options.split(',').map(o => o.trim()) : req.body.options,
            keywords: req.body.keywords ? (typeof req.body.keywords === 'string' ? req.body.keywords.split(',').map(k => k.trim()) : req.body.keywords) : []
        };
        await api.post(apiBasePath, payload);
        res.redirect('/questions');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating question');
    }
});

// GET question details
router.get('/:id', async (req, res) => {
    try {
        const response = await api.get(`${apiBasePath}/${req.params.id}`);
        res.render('questions/details.ejs', { question: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading question details');
    }
});

// GET display edit question form
router.get('/:id/edit', async (req, res) => {
    try {
        const response = await api.get(`${apiBasePath}/${req.params.id}`);
        res.render('questions/edit.ejs', { question: response.data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading question to edit');
    }
});

// PUT update question
router.put('/:id', async (req, res) => {
    try {
        const payload = {
            ...req.body,
            options: typeof req.body.options === 'string' ? req.body.options.split(',').map(o => o.trim()) : req.body.options,
            keywords: req.body.keywords ? (typeof req.body.keywords === 'string' ? req.body.keywords.split(',').map(k => k.trim()) : req.body.keywords) : []
        };
        await api.put(`${apiBasePath}/${req.params.id}`, payload);
        res.redirect('/questions');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating question');
    }
});

// DELETE delete question
router.delete('/:id', async (req, res) => {
    try {
        await api.delete(`${apiBasePath}/${req.params.id}`);
        res.redirect('/questions');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting question');
    }
});

module.exports = router;
