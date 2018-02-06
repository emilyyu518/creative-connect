angular.module('app')
.component('moodBoardItem', {
  bindings: {
    project: '<',
  },
  controller: function(addToDatabaseService) {
    this.handleClick = function(project) {
      addToDatabaseService.pin(project, (results) => {
        if (results) {
          console.log('sent to database! ', results);
        }
      })
    };
  },
  templateUrl: '/templates/mood-board-item.html'
});