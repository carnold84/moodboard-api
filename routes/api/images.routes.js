const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

const Images = require('../../models/Images.model');
const jwtOptions = require('../../config/jwtOptions');

// get all images
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const images = await Images.getImagesByUser(req.user.id);
  res.json(images);
});

// get image
router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const image = await Images.getImage({id, userId});
  res.json(image);
});

// create image
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id;
  const {description, name, projectId, url} = req.body;
  const image = await Images.createImage({description, name, projectId, url, userId});

  res.json({image, msg: 'Image created successfully'});
});

// update image
router.put('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id.toString();
  const image = Images.updateImage({...req.body, userId});

  res.json({image, msg: 'Image updated successfully'});
});

// create image
router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const image = await Images.deleteImage({id, userId});

  res.json({image, msg: 'Image deleted successfully'})
});

module.exports = router;
