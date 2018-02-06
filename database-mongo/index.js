const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const url = process.env.MONGOLAB_URI || 'mongodb://localhost/creative-connect'
mongoose.connect(url);

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
  password: String,
  projects: [projectSchema]
});

db.userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) {
      console.error(err);
      next(err);
    } else {
      user.password = hash;
      next();
    }
  });
});

db.userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    if (err) {
      console.error('error comparing passwords! ', err);
    } else {
      callback(isMatch);
    }
  });
};

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

  const projectRecord = new Project({ name, url, imgUrl });

  creators.forEach((creator) => {
    let name = creator.name;
    let url = creator.url;

    projectRecord.creators.push({ name, url });
  });

  projectRecord.save((error) => {
    if (error) {
      console.error('Error saving project to database! ', error);
    } else {
      console.log('Successfully saved project to database!', projectRecord);
    }
  });
};

module.exports.selectAll = selectAll;
module.exports.save = save;