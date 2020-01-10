const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const errorHandler = require('errorhandler');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const APP_PORT = process.env.APP_PORT || 8000;

// initialize passport with express
app.use(passport.initialize());

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

if (!isProduction) {
  app.use(errorHandler());
}

require('./config/passport');
app.use(require('./routes'));

// start app
app.listen(APP_PORT, () => {
  console.log(`Server running on port ${APP_PORT}`);
});
