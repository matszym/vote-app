angular.module('vote-app')
.controller('ChartController', ['$scope', 'poll', 'user', 'socketFactory', '$routeParams', ($scope, poll, user, socketFactory, $routeParams) => {
  $scope.user = user.getUser();
  $scope.vote = "";
  
  poll.getPoll()
  .then(result => {
    $scope.poll = poll.transform(result.data);

    // we can join the socket.io namespace now
    const ioSocket = io.connect(`/${$routeParams.id}`),
    mySocket = socketFactory({ioSocket});

    mySocket.on('chartUpdate', data => {
      $scope.poll = poll.transform(data);
    });   
  });
  
  $scope.votePoll = poll.votePoll.bind(null, $scope);
  $scope.deletePoll = poll.deletePoll;

  $scope.$on('user', (event, user) => {
    $scope.user = user;
  });


}]);