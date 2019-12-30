const passport = require('passport');
const passportJWT = require('passport-jwt');

const Users = require('../models/Users.model');
const jwtOptions = require('./jwtOptions');

let JwtStrategy = passportJWT.Strategy;

// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  let user = await Users.getUser({id: jwt_payload.id});

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

// use the strategy
passport.use(strategy);
