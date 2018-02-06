const mongoose = require('mongoose');
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
  projects: [projectSchema]
});

const User = mongoose.model('Users', userSchema);
const Project = mongoose.model('Projects', projectSchema);
const Creator = mongoose.model('Creators', creatorSchema);

const selectAll = function(callback) {
  User.projects.find({}, function(err, projects) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, projects);
    }
  });
};

const save = function(user, project) {
  const { name, url, imgUrl, creators } = project;

  User
    .findOne({username: user})
    .then(function(user) {
      if (!user) {
        console.log('Error! You\'re not logged in!');
      } else {
        const projectRecord = new Project({ name, url, imgUrl });
      
        creators.forEach((creator) => {
          let name = creator.name;
          let url = creator.url;
      
          projectRecord.creators.push({ name, url });
        });

        user.projects.push(projectRecord);
      }
    })

  // projectRecord.save((error) => {
  //   if (error) {
  //     console.error('Error saving project to database! ', error);
  //   } else {
  //     console.log('Successfully saved project to database!', projectRecord);
  //   }
  // });
};

module.exports.selectAll = selectAll;
module.exports.save = save;
module.exports.User = User;