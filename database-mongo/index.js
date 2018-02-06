const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/creative-connect');

const db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

const creatorSchema = mongoose.Schema({
  name: String,
  url: String
});

const projectSchema = mongoose.Schema({
  name: String,
  url: String,
  imgUrl: String, 
  creators: [creatorSchema]
});

const userSchema = mongoose.Schema({
  username: String,
  // password: String,
  projects: [projectSchema]
});

const User = mongoose.model('Users', userSchema);
const Project = mongoose.model('Projects', projectSchema);
const Creator = mongoose.model('Creators', creatorSchema);

const selectAll = function(callback) {
  Project.find({}, function(err, projects) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, projects);
    }
  });
};

const save = function(project) {
  const { name, url, imgUrl, creators } = project;

  const project = new Project({ name, url, imgUrl });

  creators.forEach((creator) => {
    let name = creator.display_name;
    let url = creator.website ? creator.website : creator.url;
    project.creators.push({ name, url });
  });

  project.save((error) => {
    if (error) {
      console.error('Error saving project to database! ', error);
    } else {
      console.log('Successfully save project to database!');
    }
  });
};

module.exports.selectAll = selectAll;