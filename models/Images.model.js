const Sequelize = require('sequelize');
const database = require('./database');

// create image model
const Image = database.define('image', {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  url: {
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.STRING,
  },
});

// create table with image model
Image.sync()
  .then(() => console.log('Image table created successfully'))
  .catch(err => console.log('oooh, did you enter wrong database credentials?'));

// create some helper functions to work on the database
Image.createImage = async ({name, description, userId}) => {
  return await Image.create({name, description, url, userId});
};

Image.updateImage = async obj => {
  return await Image.update(obj, {
    where: {id: obj.id},
  });
};

Image.getImagesByUser = async obj => {
  return await Image.findAll({
    where: obj,
  });
};

Image.getImagesByProject = async obj => {
  return await Image.findAll({
    where: obj,
  });
};

Image.getAllImages = async () => {
  return await Image.findAll();
};

Image.getImage = async obj => {
  return await Image.findOne({
    where: obj,
  });
};

Image.deleteImage = async obj => {
  return await Image.destroy({
    where: obj,
  });
};

module.exports = Image;
