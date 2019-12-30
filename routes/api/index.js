const express = require('express');
const router = express.Router();

router.use('/projects', require('./projects.routes'));
router.use('/users', require('./users.routes'));

module.exports = router;
