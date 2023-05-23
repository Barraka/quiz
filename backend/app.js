const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('./server/passport');
const cors =require('cors');
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const questions = require('./server/quiz.json');
const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const sess = {
    secret: process.env.SECRETKEY,
    cookie: { maxAge: 864000000, secure: true, sameSite: "none" },
    rolling: true,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB,
        collection: 'sessions'
    }),
};
const corsOptions= {
    origin: ['http://localhost:5173','http://localhost:5174', 'https://odinbook-production.up.railway.app'],
    credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

//----Routes
app.use('/', quizRoutes);
app.use('/auth', authRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.error('in 404');
    console.log('url: ', req.url);
  //next(createError(404));
  res.sendStatus(404);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('in error handler');
});

module.exports = app;
