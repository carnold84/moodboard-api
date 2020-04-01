const Sequelize = require('sequelize');
const database = require('./database');

const ImageProject = require('./ImageProject.model');
const LinkProject = require('./LinkProject.model');

// create project model
const Project = database.define('project', {
  name: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.STRING,
  },
  userId: {
    type: Sequelize.STRING,
  },
});

// create table with project model
Project.sync()
  .then(() => console.log('Project table created successfully'))
  .catch(err => console.log('oooh, did you enter wrong database credentials?'));

Project.createProject = async ({ name, description, userId }) => {
  let project = await Project.create({ name, description, userId });
  project.dataValues.imageIds = [];
  project.dataValues.linkIds = [];
  return project;
};

Project.updateProject = async obj => {
  return await Project.update(obj, {
    where: { id: obj.id },
  });
};

Project.getProjectsByUser = async obj => {
  const projects = await Project.findAll({
    where: obj,
  });

  let numProjects = projects.length;
  let i = 0;

  for (i; i < numProjects; i++) {
    const project = projects[i];
    project.dataValues.imageIds = await getImageIds(project.id);
    project.dataValues.linkIds = await getLinkIds(project.id);
  }

  return projects;
};

const getImageIds = async projectId => {
  const imageProjects = await ImageProject.findAll({
    where: { projectId },
  });

  if (imageProjects.length === 0) {
    return [];
  }

  return imageProjects.map(imageProject => {
    return imageProject.imageId;
  });
};

const getLinkIds = async projectId => {
  const linkProjects = await LinkProject.findAll({
    where: { projectId },
  });

  if (linkProjects.length === 0) {
    return [];
  }

  return linkProjects.map(linkProject => {
    return linkProject.linkId;
  });
};

Project.getAllProjects = async () => {
  return await Project.findAll();
};

Project.getProject = async obj => {
  return await Project.findOne({
    where: obj,
  });
};

Project.deleteProject = async obj => {
  return await Project.destroy({
    where: obj,
  });
};

module.exports = Project;
