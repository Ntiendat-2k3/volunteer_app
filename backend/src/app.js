require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');

const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');
const configurePassport = require('./config/passport');
const db = require('./database/models');

const app = express();

app.use(cors({origin: 'http://localhost:5173', credentials: true}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 ngày
    }
}));

// Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', routes);

app.use(errorHandler);


module.exports = app;
