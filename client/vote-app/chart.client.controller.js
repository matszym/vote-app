angular.module('vote-app')
.controller('ChartController', ['$scope', 'poll', 'user', ($scope, poll, user) => {
  $scope.user = user.getUser();
  $scope.vote = "";
  poll.getPoll($scope);
  $scope.votePoll = poll.votePoll.bind(null, $scope);

  $scope.$on('user', (event, user) => {
    $scope.user = user;
  });
}]);