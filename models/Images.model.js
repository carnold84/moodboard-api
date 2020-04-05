const Sequelize = require('sequelize');
const cloudinary = require('cloudinary').v2;

const database = require('./database');

const ImageProject = require('./ImageProject.model');

const Op = Sequelize.Op;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// create image model
const Image = database.define('image', {
  description: {
    type: Sequelize.STRING,
  },
  fileName: {
    type: Sequelize.STRING,
  },
  format: {
    type: Sequelize.STRING,
  },
  name: {
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

const uploadToCloudinary = url => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(url, { folder: "aura" }, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

const deleteFromCloudinary = id => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(id, (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

Image.createImage = async ({ description, name, projectId, url, userId }) => {
  const response = await uploadToCloudinary(url);

  const image = await Image.create({
    description,
    fileName: response.public_id,
    format: response.format,
    name,
    url,
    userId
  });

  if (projectId) {
    await ImageProject.create({ imageId: image.id, projectId });
  }
  return image;
};

Image.updateImage = async ({ id, userId, ...rest }) => {
  return await Image.update({ ...rest }, {
    where: { id, userId },
  });
};

Image.linkToProject = async ({ imageId, projectId }) => {
  return await ImageProject.create({ imageId, projectId });
};

Image.unlinkFromProject = async ({ imageId, projectId }) => {
  return await ImageProject.destroy({
    where: { imageId, projectId },
  });
};

Image.getImagesByProject = async ({ id, userId }) => {
  const imageProjects = await ImageProject.findAll({
    where: { projectId: id },
  });
  const imageIds = imageProjects.map(value => {
    return value.imageId;
  });
  return await Image.findAll({
    where: { id: imageIds, userId },
  });
};

Image.getImagesByUser = async (userId, {exclude, ids}) => {
  let whereStatement = {
    userId,
  };

  if(exclude) {
    whereStatement.id = {
      [Op.notIn]: exclude,
    };
  }

  if(ids) {
    whereStatement.id = {
      [Op.in]: ids,
    };
  }
  
  return await Image.findAll({
    where: whereStatement,
  });
};

Image.getAllImages = async () => {
  return await Image.findAll();
};

Image.getImage = async ({ id, userId }) => {
  return await Image.findOne({
    where: { id, userId },
  });
};

Image.deleteImage = async ({ id, userId }) => {
  const image = await Image.getImage({ id, userId });

  if (image) {
    await deleteFromCloudinary(image.fileName);
  }

  await ImageProject.destroy({
    where: { imageId: id },
  });

  await Image.destroy({
    where: { id, userId },
  });

  return id;
};

module.exports = Image;
