var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// app.use('/.well-known', express.static(path.join(__dirname, '.well-known'), {
//   setHeaders: (res, path, stat) => {
//     if (path.endsWith('apple-app-site-association')) {
//       res.set('Content-Type', 'application/json');
//     }
//     if (path.endsWith('assetlinks.json')) {
//       res.set('Content-Type', 'application/json');
//     }
//   }
// }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
