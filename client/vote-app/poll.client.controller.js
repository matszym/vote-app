angular.module('vote-app')
.controller('PollController', ['poll', '$scope', (poll, $scope) => {
  $scope.poll = {
    title: '',
    options: ''
  };

  $scope.createPoll = poll.createPoll;
}]);