const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
require('./server/passport');
const cors =require('cors');
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const {pushQuestion} = require('./server/models');
const questions = require('./server/quiz.json');

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
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const question= {
    _id:123456789,
    question:"This is a test question",
    answers: [1,2,3,4],
    submited: "me",
}
// pushQuestion(question);
questions.forEach(async qu=> {
    await pushQuestion(qu);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
