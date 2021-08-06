var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var express = require('express');
var timeout = require('connect-timeout');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "shop"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(timeout('1s'));
app.use(cookieParser());
app.use(haltOnTimedout);

app.use('/', indexRouter);
app.use('/users', usersRouter);

//wyszukaj produkt
app.post('/selectProduct', function (req, res) {
  let product = req.body;
  let searchProduct;
  product[0] === '' ? searchProduct = 'x' : searchProduct = product;
  console.log("wpisywany produkt: "+product);
  con.query(`SELECT * FROM products WHERE value LIKE '${searchProduct}%'`, function (err, result, fields) {
    if (err) throw err;
    global.globalData = result;
  });
})
app.get('/selectProduct', function (req, res) {
  res.end(JSON.stringify(globalData));
})

con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

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
