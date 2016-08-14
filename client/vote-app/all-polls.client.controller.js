angular.module('vote-app')
.controller('AllPollsController', ['$scope', 'poll', ($scope, poll) => {
  poll.getPolls($scope, {
    limit: 10,
    offset: 0
  });

  $scope.getPolls = poll.getPolls.bind(null, $scope);
}]);
