const express = require('express');
const router = express.Router();

router.use('/images', require('./images.routes'));
router.use('/links', require('./links.routes'));
router.use('/projects', require('./projects.routes'));
router.use('/users', require('./users.routes'));

module.exports = router;
