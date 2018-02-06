var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var dotenv = require('dotenv').config();
var db = require('../database-mongo');
var behance = require('../helpers/behance')

var app = express();

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy ({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, 
  function(accessToken, refreshToken, profile, done) {
    db.User.findOne({username: profile.id}, function(err, user) {
      if (err) {
        return done(err);
      } if (user) {
        return done(null, user);
      } else {
        db.User.create({username: profile.id});
      }
    });
  }
))

app.use(express.static(__dirname + '/../angular-client'));
app.use(express.static(__dirname + '/../node_modules'));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

app.get('logout', function(request, response) {
  request.logout();
  response.redirect('/');
});

app.post('/search', function(request, response) {
  const query = request.body.query;
  behance.searchBehance(query, (error, res, body) => {
    if (error) {
      console.error('Error searching Behance! ', error);
    } else {
      const projects = JSON.parse(body).projects;
      const projectsResponse = projects.map((project) => {
        projectRecord = {};
        projectRecord.name = project.name;
        projectRecord.url = project.url;
        projectRecord.imgUrl = project.covers['404'];
        projectRecord.creators = project.owners.map((owner) => {
          const creator = {};
          creator.name = owner.display_name;
          let tempUrl = owner.website ? owner.website : owner.url;
          if (!tempUrl.includes('https') || !tempUrl.includes('http')) {
            creator.url = `http://${tempUrl}`;
          } else {
            creator.url = tempUrl;
          }
          return creator;
        });
        return projectRecord;
      });
      response.end(JSON.stringify(projectsResponse));
    }
  })
});

app.post('/mood-board', function(request, response) {
  // get project information 
  const project = request.body.project;
  const user = request.user;
  db.save(user, project);
  response.end();
});

app.get('/mood-board', function (request, response) {
  if(request.user) {
    db.selectAll(function(error, data) {
      if(error) {
        response.sendStatus(500);
      } else {
        response.json(data);
      }
    });
  } else {
    behance.searchBehance('', (error, res, body) => {
      if (error) {
        console.error("Error searching Behance! ", error);
      } else {
        const projects = JSON.parse(body).projects;
        const projectsResponse = projects.map(project => {
          projectRecord = {};
          projectRecord.name = project.name;
          projectRecord.url = project.url;
          projectRecord.imgUrl = project.covers["404"];
          projectRecord.creators = project.owners.map(owner => {
            const creator = {};
            creator.name = owner.display_name;
            let tempUrl = owner.website ? owner.website : owner.url;
            if (!tempUrl.includes("https") || !tempUrl.includes("http")) {
              creator.url = `http://${tempUrl}`;
            } else {
              creator.url = tempUrl;
            }
            return creator;
          });
          return projectRecord;
        });
        response.end(JSON.stringify(projectsResponse));
      }
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`listening on port ${port}!`);
});

