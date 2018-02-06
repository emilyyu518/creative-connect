angular.module('app')
.component('search', {
  bindings: {
    // items: '<',
  },
  controller: function(searchService) {
    this.handleClick = function(query) {
      searchService.behance(query, (results) => {
        if (results) {

        }
      });
    }
  },
  templateUrl: '/templates/search.html'
});