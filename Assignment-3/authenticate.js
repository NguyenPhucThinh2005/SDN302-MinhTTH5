const jwt = require('jsonwebtoken');
const Question = require('./models/question.model');

// Secret key for JWT
const SECRET_KEY = process.env.SECRET_KEY || "assignment3_secret_key";

exports.getToken = function(user) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: 3600 });
};

exports.verifyUser = (req, res, next) => {
    // Get auth header
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Token is not valid!" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ success: false, message: "You are not authenticated!" });
    }
};

exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        next();
    } else {
        const err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
};

exports.verifyAuthor = async (req, res, next) => {
    try {
        const questionId = req.params.questionId;
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, message: "Question not found" });
        }
        
        // Compare author's objectId with the current user's objectId
        // Ensure both are treated as strings for safe comparison
        if (question.author && question.author.toString() === req.user._id.toString()) {
            next();
        } else {
            return res.status(403).json({ success: false, message: "You are not the author of this question" });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
