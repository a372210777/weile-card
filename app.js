'use strict';

var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  consolidate = require('consolidate'),
  compress = require('compression'),
  morgan = require('morgan'),
  config = require('./config/config'),
  log4 = require('./app/tools/log4js');

var app = express();
// Set swig as the template engine
app.engine('html', consolidate.swig);
app.set('view engine', 'html');
app.set('views', './app/views');
// 
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(morgan(config.morganFormat));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
// https://github.com/expressjs/session
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'keyboard cat',
  store: new MongoStore({
    url: config.db
  })
}));
// compress Should be placed before express.static
app.use(compress({
  filter: function(req, res) {
    return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
  },
  level: 9
}));
app.use(express.static(path.join(__dirname, config.publicPath)));
// router
require('./app/routes/serverPage')(app);
require('./app/routes/weileService')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log4.error(err);
    res.redirect('/');
  });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  log4.error(err);
  res.redirect('/');
});

var server = app.listen(config.port, function() {
  console.log('      *****************              ');
  console.log('      *****************              ');
  console.log('      ***                            ');
  console.log('      ***                            ');
  console.log('      *****************              ');
  console.log('      *****************              ');
  console.log('      ***                            ');
  console.log('      ***                            ');
  console.log('      ***                            ');
  console.log('      ***                            ');
  console.log('      ***                            ');
  console.log('========================listening at:%s', server.address().port);
  console.log('========================%s', config.weiLeServicePath);
});
module.exports = app;