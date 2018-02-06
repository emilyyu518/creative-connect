angular.module('app')
.component('search', {
  bindings: {
    populate: '<',
  },
  controller: function(searchService) {
    this.handleClick = function(query) {
      searchService.behance(query, (results) => {
        if (results) {
          console.log('results!!!1 ', results);
          this.populate(results);
        }
      });
    };
  },
  templateUrl: '/templates/search.html'
});