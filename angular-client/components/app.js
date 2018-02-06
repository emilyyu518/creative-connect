angular.module('app')
.controller('AppCtrl', function(moodBoardItemsService) {
  moodBoardItemsService.getAll((data) => {
    this.projects = data;
  });
})
.component('app', {
  bindings: {},
  controller: 'AppCtrl',
  templateUrl: '/templates/app.html'
})
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: '/templates/mood-board.html', 
    // controller: 'moodBoard'  
  })
  .when('/search-results', {
    templateUrl: '/templates/search-results.html',
    // controller: 'searchResults'
  })
});