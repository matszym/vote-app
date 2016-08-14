angular.module('vote-app')
.controller('ChartController', ['$scope', 'poll', '$interval', ($scope, poll, $setInterval) => {
  $scope.vote = "";
  poll.getPoll($scope);
  $scope.votePoll = poll.votePoll.bind(null, $scope);
}]);