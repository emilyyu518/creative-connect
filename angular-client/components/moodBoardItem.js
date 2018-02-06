angular.module('app')
.component('moodBoardItem', {
  bindings: {
    project: '<',
  },
  controller: function() {
    // this.getCreators = (project) => {
    //   project.creators.forEach((creator) => {

    //   })
    // };
  },
  templateUrl: '/templates/mood-board-item.html'
});