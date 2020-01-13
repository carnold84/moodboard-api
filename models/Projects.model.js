const Sequelize = require('sequelize');
const database = require('./database');

const ImageProject = require('./ImageProject.model');

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
  return await Project.create({ name, description, userId });
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
  }

  return projects;
};

const getImageIds = async projectId => {
  const imageProjects = await ImageProject.findAll({
    where: { projectId },
  });

  return imageProjects.map(imageProject => {
    return imageProject.imageId;
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
