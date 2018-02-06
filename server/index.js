var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();
var db = require('../database-mongo');
var behance = require('../helpers/behance')
var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/../angular-client'));
app.use(express.static(__dirname + '/../node_modules'));

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
          creator.url = owner.website ? owner.website : owner.url;
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
  db.save(project);
});

app.get('/mood-board', function (request, response) {
  db.selectAll(function(error, data) {
    if(error) {
      response.sendStatus(500);
    } else {
      response.json(data);
    }
  });
});


app.listen(3000, function() {
  console.log('listening on port 3000!');
});

