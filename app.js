var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
const session = require('express-session')

const { sequelize } = require('./models');
require("dotenv").config()
const formData = require("express-form-data");
const os = require("os");

global.atob = require("atob");

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var singUpRouter = require('./routes/signUp');
var usersRouter = require('./routes/users');
var cartRouter = require('./routes/cart');
var logoutRouter = require('./routes/logout');

var app = express();

sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(logger('dev'));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signUp', singUpRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);


const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};
// parse data with connect-multiparty. 
app.use(formData.parse(options));
// delete from the request all empty files (size == 0)
app.use(formData.format());
// change the file objects to fs.ReadStream 
app.use(formData.stream());
// union the body and the files
app.use(formData.union());


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
