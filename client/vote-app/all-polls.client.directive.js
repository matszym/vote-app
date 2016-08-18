angular.module('vote-app')
.directive('allPolls', () => {
  return {
    controller: "AllPollsController",
    templateUrl: 'views/all-polls.client.view.html'
  }
});