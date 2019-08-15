"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// HTTP REQUEST LOGGER
// PARSE HTML BODY

/* mongodb connection */
var db = _mongoose["default"].connection;
db.on('error', console.error);
db.once('open', function () {
  console.log('Connected to mongodb server!');
});

_mongoose["default"].connect('mongodb://localhost/codelab');

var app = (0, _express["default"])();
var port = 3000;
var devPort = 4000;
app.use((0, _morgan["default"])('dev'));
app.use(_bodyParser["default"].json());
/* use session */

app.use((0, _expressSession["default"])({
  secret: 'JackChoi$!$!',
  resave: false,
  saveUninitialized: true
}));
app.use('/', _express["default"]["static"](_path["default"].join(__dirname, process.env.NODE_ENV == 'development' ? './../../public' : './../public')));
/* routes */

app.use('/api', _routes["default"]);
/* support client-side routing */

app.get('*', function (req, res) {
  res.sendFile(_path["default"].resolve(__dirname, process.env.NODE_ENV == 'development' ? './../../public/index.html' : './../public/index.html'));
});
/* handle error */

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(port, function () {
  console.log('Express is listening on port', port);
});

if (process.env.NODE_ENV == 'development') {
  console.log('DEVELOPEMENT MODE!!!');

  var config = require('../../webpack.dev.config');

  var compiler = (0, _webpack["default"])(config);
  var devServer = new _webpackDevServer["default"](compiler, config.devServer);
  devServer.listen(devPort, function () {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}