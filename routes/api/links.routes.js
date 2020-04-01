const express = require('express');
const passport = require('passport');
const router = express.Router();

const Links = require('../../models/Links.model');

// get all links
router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const links = await Links.getLinksByUser(req.user.id);
  res.json(links);
});

// get link
router.get('/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const link = await Links.getLink({id, userId});
  res.json(link);
});

// get links for project
router.get('/project/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const link = await Links.getLinksByProject({id, userId});
  res.json(link);
});

// create link
router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id;
  const {description, name, projectId, url} = req.body;
  const link = await Links.createLink({description, name, projectId, url, userId});

  res.json({link, msg: 'Link created successfully'});
});

// update link
router.put('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id.toString();
  const link = Links.updateLink({...req.body, userId});

  res.json({link, msg: 'Link updated successfully'});
});

// delete link
router.delete('/:id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  const userId = req.user.id.toString();
  const {id} = req.params;
  const linkId = await Links.deleteLink({id, userId});

  res.json({linkId, msg: 'Link deleted successfully'})
});

module.exports = router;
