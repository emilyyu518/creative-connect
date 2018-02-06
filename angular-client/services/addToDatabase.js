angular.module('app')
.service('addToDatabaseService', function($http) {
  this.pin = function(project, callback) {
    $http.post('/mood-board', {project: project})
    .then(function({data}) {
      if(callback) {
        callback(data);
      }
    })
    .catch(function(err) {
      console.log(err);
    });
  };
});