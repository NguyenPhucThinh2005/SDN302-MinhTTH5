const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();

const frontendRoutes = require('./routes/frontend');

const app = express();
const PORT = process.env.FRONTEND_PORT || 4000;

// Setup Handlebars as the main view engine
app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Configure EJS for specific views. 
// Note: Since hbs is set as default, we will need to explicitly provide .ejs extension when rendering ejs files.
app.engine('ejs', require('ejs').renderFile);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Use frontend routes
app.use('/', frontendRoutes);

// Start frontend server
app.listen(PORT, () => {
    console.log(`Frontend UI server is running on port ${PORT}`);
});
