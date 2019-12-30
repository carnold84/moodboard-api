const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

const Projects = require('../../models/Projects.model');
const jwtOptions = require('../../config/jwtOptions');

// get all projects
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const userId = req.user.id;
  Projects.getProjectsByUser({userId}).then(project => res.json(project));
});

// get project
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  const {id} = req.params;
  Projects.getProject({id}).then(project => res.json(project));
});

// create project
router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  const userId = req.user.id;
  const {description, name} = req.body;
  Projects.createProject({description, name, userId}).then(project =>
    res.json({project, msg: 'Project created successfully'}),
  );
});

// update project
router.put('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const user = req.user;
  const {description, id, name, userId} = req.body;

  // make sure it's their project
  if (userId === user.id.toString()) {
    Projects.updateProject({description, id, name}).then(project =>
      res.json({project, msg: 'Project updated successfully'}),
    );
  } else {
    res.status(404).json({msg: 'Project not found.'});
  }
});

// create project
router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const project = await Projects.getProject({id});

  // make sure it's their project
  if (project && project.userId === userId) {
    Projects.deleteProject({id}).then(project => res.json({project, msg: 'Project deleted successfully'}));
  } else {
    res.status(404).json({msg: 'Project not found.'});
  }
});

module.exports = router;
