require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redis = require('redis')
const client = redis.createClient({
    host: process.env.REDIS_CONNECTION || 'localhost'
})
const mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.MONGO_CONNECTION || 'localhost'}:27017/test`, {useNewUrlParser: true, useUnifiedTopology: true});


client.on('erro', error => console.log(error))
client.on('connect', error => console.log('Redis is running...'))

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('MongoDB is running...')
});

var indexRouter = require('./routes/index');
var comentarioRouter = require('./routes/comentario');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new RedisStore({client: client}),
  saveUninitialized: false,
  resave: false,
  secret: "ultra secreto"
}))

app.use('/', indexRouter);
app.use('/comentario', comentarioRouter);

//catch 404 and forward to error handler
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
