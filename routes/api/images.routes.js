const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

const Images = require('../../models/Images.model');
const Projects = require('../../models/Projects.model');
const jwtOptions = require('../../config/jwtOptions');

// get all images
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  const userId = req.user.id;
  Images.getImagesByUser({userId}).then(image => res.json(image));
});

// get image
router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const userId = req.user.id;
  const {id} = req.params;
  const image = await Images.getImage({id});

  if (image.userId === userId) {
    res.json(image);
  } else {
    res.status(404).json({msg: 'Image not found.'});
  }
});

// create image
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id;
  const {description, name, projectId, url} = req.body;
  const image = await Images.createImage({description, name, url, userId});

  if (projectId) {
    const project = await Projects.getProject({id: projectId});

    if (project.userId === userId) {
        
    }
  }

  res.json({image, msg: 'Image created successfully'});
});

// update image
router.put('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const user = req.user;
  const {description, id, name, userId} = req.body;

  // make sure it's their image
  if (userId === user.id.toString()) {
    Images.updateImage({description, id, name}).then(image => res.json({image, msg: 'Image updated successfully'}));
  } else {
    res.status(404).json({msg: 'Image not found.'});
  }
});

// create image
router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const image = await Images.getImage({id});

  // make sure it's their image
  if (image && image.userId === userId) {
    Images.deleteImage({id}).then(image => res.json({image, msg: 'Image deleted successfully'}));
  } else {
    res.status(404).json({msg: 'Image not found.'});
  }
});

module.exports = router;
