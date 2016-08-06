angular.module('authentication')
.controller('AuthenticationController', ['$scope', 'user', ($scope, user) => {
  $scope.auth = {};
  user.loadUser($scope.auth);

  $scope.logOut = () => {
    user.logOut.bind(null, $scope.auth)();
    console.log($scope.auth);
  }
}]);