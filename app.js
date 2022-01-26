require("dotenv").config("./.env");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const authenticate = require("./authenticate");
const mongoose = require("mongoose");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const uploadRouter = require('./routes/upload');
const accountRouter = require('./routes/account');
const checkoutRouter = require("./routes/checkout");
const successRouter = require("./routes/success");


const app = express();

mongoose.connect(process.env.mongo)
  .then(() => console.log("Connected safely to database."),
  err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret: process.env.session_id,
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: "lax"
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authenticate.initialize);
app.use(authenticate.session);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin64127415', adminRouter);
app.use('/upload', uploadRouter); 
app.use('/account', accountRouter);
app.use('/create-checkout-session', checkoutRouter);
app.use('/success', successRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
