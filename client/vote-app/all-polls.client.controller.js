angular.module('vote-app')
.controller('AllPollsController', ['$scope', 'poll', '$attrs', 'user', ($scope, poll, $attrs, auth) => {
  let user = auth.getUser();
  $scope.queryParam = {};

  if ($attrs.hasOwnProperty('ownerOnly')) {
    $scope.queryParam._creator = user._id;
  }

  poll.getPolls($scope, {
    limit: 10,
    offset: 0
  });

  $scope.getPolls = poll.getPolls.bind(null, $scope);
}]);
