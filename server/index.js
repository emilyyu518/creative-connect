var express = require('express');
var bodyParser = require('body-parser');
var db = require('../database-mongo');
var behance = require('../helpers/behance')

var app = express();

app.use(express.static(__dirname + '/../angular-client'));
app.use(express.static(__dirname + '/../node_modules'));

app.post('/search', function(request, response) {
  const query = request.body.query;
  behance.searchBehance(query, (error, res, body) => {
    if (error) {
      console.error('Error searching Behance! ', error);
    } else {
      const projects = JSON.parse(body);
      projects.forEach((project) => {
        projectRecord = {};
        projectRecord.name = project.name;
        projectRecord.url = project.url;
        projectRecord.imgUrl = project.covers['404'];
        projectRecord.creators = project.owners;
        
        db.save(projectRecord);
      });
    }
    response.end();
  })
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

