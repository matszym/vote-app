angular.module('navigation')
.controller('NavigationController', ['$scope', '$window', ($scope, $window) => {
  $scope.twitterAuth = () => $window.location.assign('/auth/twitter')
}]);
