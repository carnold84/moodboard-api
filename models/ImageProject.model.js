const Sequelize = require('sequelize');
const database = require('./database');

const ImageProject = database.define('imageProject', {
  imageId: {
    type: Sequelize.INTEGER(11),
  },
  projectId: {
    type: Sequelize.INTEGER(11),
  },
});

ImageProject.sync()
  .then(() => console.log('Image -> Project table created successfully'))
  .catch(err => console.log('oooh, did you enter wrong database credentials?'));

module.exports = ImageProject;
