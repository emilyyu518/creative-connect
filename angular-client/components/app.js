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
});