const Sequelize = require('sequelize');
const database = require('./database');

const LinkProject = database.define('linkProject', {
  linkId: {
    type: Sequelize.INTEGER(11),
  },
  projectId: {
    type: Sequelize.INTEGER(11),
  },
});

LinkProject.sync()
  .then(() => console.log('Link -> Project table created successfully'))
  .catch(err => console.log('oooh, did you enter wrong database credentials?'));

module.exports = LinkProject;
