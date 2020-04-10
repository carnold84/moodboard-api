const express = require('express');
const passport = require('passport');
const router = express.Router();

const Images = require('../../models/Images.model');

// get all images
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const ids = req.query.ids;
  const exclude = req.query.exclude;
  const images = await Images.getImagesByUser(req.user.id, {exclude, ids});

  res.json(images);
});

// get image
router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const image = await Images.getImage({id, userId});
  res.json(image);
});

// get images for project
router.get('/project/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const image = await Images.getImagesByProject({id, userId});
  res.json(image);
});

// create image
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id;
  const {description, name, projectId, url} = req.body;
  const image = await Images.createImage({description, name, projectId, url, userId});

  res.json({image, msg: 'Image created successfully'});
});

// link an image to a project
router.post('/link-to-project', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { imageId, projectId } = req.body;
  await Images.linkToProject({ imageId, projectId });

  res.json({ ids: { imageId, projectId }, msg: 'Image linked successfully' });
});

// link an image to a project
router.post('/unlink-from-project', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { imageId, projectId } = req.body;
  await Images.unlinkFromProject({ imageId, projectId });

  res.json({ ids: { imageId, projectId }, msg: 'Image unlinked successfully' });
});

// update image
router.put('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id.toString();
  const image = await Images.updateImage({...req.body, userId});

  res.json({image, msg: 'Image updated successfully'});
});

// delete image
router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const imageId = await Images.deleteImage({id, userId});

  res.json({imageId, msg: 'Image deleted successfully'})
});

module.exports = router;
