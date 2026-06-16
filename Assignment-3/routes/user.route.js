const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../authenticate');

router.post('/register', userController.register);
router.post('/login', userController.login);

// Task 3: When an Admin sends a GET request to /users you will return the details of all the users.
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, userController.getUsers);

module.exports = router;
