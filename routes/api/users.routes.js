const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

const Users = require('../../models/Users.model');
const jwtOptions = require('../../config/jwtOptions');

// get all users
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res) {
  Users.getAllUsers().then(user => res.json(user));
});

// get all users
router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res) {
  const {id} = req.params;
  Users.getUser({id}).then(user => res.json(user));
});

// register route
router.post('/register', function(req, res, next) {
  const {email, name, password} = req.body;
  Users.createUser({email, name, password}).then(user =>
    res.json({user: {email: user.email, name: user.name}, msg: 'Account created successfully'}),
  );
});

//login route
router.post('/login', async function(req, res, next) {
  const {email, password} = req.body;
  if (email && password) {
    let user = await Users.getUser({email});

    if (user && Users.validatePassword({user, password})) {
      // from now on we'll identify the user by the id and the id is the
      // only personalized value that goes into our token
      let payload = {id: user.id};
      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({msg: 'ok', token: token});
    } else {
      res.status(401).json({msg: 'Email or password is incorrect'});
    }
  }
});

module.exports = router;
