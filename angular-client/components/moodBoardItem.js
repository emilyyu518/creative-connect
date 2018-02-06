angular.module('app')
.component('moodBoardItem', {
  bindings: {
    project: '<',
    populate: '<'
  },
  controller: function(addToDatabaseService, moodBoardItemsService) {
    this.handleClick = function(project) {
      addToDatabaseService.pin(project, (results) => {
        if (results) {
          console.log('sent to database! ', results);
        }
        moodBoardItemsService.getAll((data) => {
          this.populate(data);
        });
      })
    };
  },
  templateUrl: '/templates/mood-board-item.html'
});