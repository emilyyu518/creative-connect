var express = require('express');
var bodyParser = require('body-parser');
var items = require('../database-mongo');
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
        projectRecord.creator = project.owners[0].display_name;
        projectRecord.creatorUrl = project.owners[0].website ? project.owners[0].website : project.owners[0].url;
        db.save(projectRecord);
      });
    }
    response.end();
  })
});
app.get('/items', function (req, res) {
  items.selectAll(function(err, data) {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

