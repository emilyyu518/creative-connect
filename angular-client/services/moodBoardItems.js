angular.module('app')
.service('moodBoardItemsService', function($http) {
  this.getAll = function(callback) {
    $http.get('/mood-board')
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