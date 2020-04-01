const Sequelize = require('sequelize');

const database = require('./database');

const LinkProject = require('./LinkProject.model');

// create link model
const Link = database.define('link', {
  description: {
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

// create table with link model
Link.sync()
  .then(() => console.log('Link table created successfully'))
  .catch(err => console.log('oooh, did you enter wrong database credentials?'));

Link.createLink = async ({ description, name, projectId, url, userId }) => {
  const link = await Link.create({
    description,
    name,
    url,
    userId
  });

  if (projectId) {
    await LinkProject.create({ linkId: link.id, projectId });
  }
  return link;
};

Link.updateLink = async ({ id, userId, ...rest }) => {
  return await Link.update({ ...rest }, {
    where: { id, userId },
  });
};

Link.getLinksByProject = async ({ id, userId }) => {
  const linkProjects = await LinkProject.findAll({
    where: { projectId: id },
  });
  const linkIds = linkProjects.map(value => {
    return value.linkId;
  });
  return await Link.findAll({
    where: { id: linkIds, userId },
  });
};

Link.getLinksByUser = async id => {
  return await Link.findAll({
    where: { userId: id },
  });
};

Link.getAllLinks = async () => {
  return await Link.findAll();
};

Link.getLink = async ({ id, userId }) => {
  return await Link.findOne({
    where: { id, userId },
  });
};

Link.deleteLink = async ({ id, userId }) => {
  await LinkProject.destroy({
    where: { linkId: id },
  });

  await Link.destroy({
    where: { id, userId },
  });

  return id;
};

module.exports = Link;
