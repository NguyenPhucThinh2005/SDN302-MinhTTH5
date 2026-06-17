const User = require('../models/user.model');
const authenticate = require('../authenticate');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
    try {
        const { username, password, admin } = req.body;
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            password: hashedPassword,
            admin: admin || false
        });

        await newUser.save();
        res.status(201).json({ success: true, message: "User created successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = authenticate.getToken({ _id: user._id, admin: user.admin });
        res.status(200).json({ 
            success: true, 
            token: token, 
            message: "You are successfully logged in!",
            user: {
                _id: user._id,
                username: user.username,
                admin: user.admin
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
