angular.module('vote-app')
.controller('PollController', ['poll', '$scope', (poll, $scope) => {
  $scope.createPoll = poll.createPoll;
}]);