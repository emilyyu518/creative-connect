angular.module('app')
.component('search', {
  bindings: {
    // items: '<',
  },
  controller: function(searchService) {
    this.handleClick = function(query) {
      searchService.behance(query, (results) => {
        if (results) {
          console.log('results!!!1 ', results);
        }
      });
    }
  },
  templateUrl: '/templates/search.html'
});