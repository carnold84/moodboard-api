const bodyParser = require('body-parser');
const cors = require('cors')
const dotenv = require('dotenv');
const errorHandler = require('errorhandler');
const express = require('express');
const passport = require('passport');

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  dotenv.config();
}

const app = express();
const APP_PORT = process.env.APP_PORT || 8000;

const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));
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
