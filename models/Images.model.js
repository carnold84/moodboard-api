const Sequelize = require('sequelize');
const database = require('./database');

const ImageProject = require('./ImageProject.model');

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
Image.createImage = async ({description, name, projectId, url, userId}) => {
  const image = await Image.create({description, name, url, userId});
  if (projectId) {
    ImageProject.create({imageId: image.id, projectId});
  }
  return image;
};

Image.updateImage = async ({id, userId, ...rest}) => {
  return await Image.update({...rest}, {
    where: {id, userId},
  });
};

Image.getImagesByProject = async ({id, userId}) => {
  const imageProjects = await ImageProject.findAll({
    where: {projectId: id},
  });
  const imageIds = imageProjects.map(value => {
    return value.imageId;
  });
  console.log('imageIds', imageIds, userId);
  return await Image.findAll({
    where: {id: imageIds, userId},
  });
};

Image.getImagesByUser = async id => {
  return await Image.findAll({
    where: {userId: id},
  });
};

Image.getAllImages = async () => {
  return await Image.findAll();
};

Image.getImage = async ({id, userId}) => {
  return await Image.findOne({
    where: {id, userId},
  });
};

Image.deleteImage = async ({id, userId}) => {
  return await Image.destroy({
    where: {id, userId},
  });
};

module.exports = Image;
