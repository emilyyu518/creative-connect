angular.module('app')
.component('listItem', {
  bindings: {
    item: '<',
  },
  controller: function() {},
  templateUrl: '/templates/mood-board-item.html'
});