const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const errorHandler = require('errorhandler');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

// initialize passport with express
app.use(passport.initialize());

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

if (!isProduction) {
  app.use(errorHandler());
}

require('./config/passport');
app.use(require('./routes'));

// start app
app.listen(8000, () => {
  console.log('Server running on http://localhost:8000/');
});
