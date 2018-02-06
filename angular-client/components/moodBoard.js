angular.module('app')
.component('moodBoard', {
  bindings: {
    projects: '<',
    populate: '<'
  },
  controller: function() {},
  templateUrl: '/templates/mood-board.html'
});