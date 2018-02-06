angular.module('app')
.service('searchService', function($http) {
  this.behance = function(query, callback) {
    $http.post('/search', {query: query})
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