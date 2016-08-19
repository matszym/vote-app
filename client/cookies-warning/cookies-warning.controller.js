angular.module('cookiesWarning')
.controller('CookiesWarningController', ['$scope', 'cookie', ($scope, cookie) => {
  $scope.isAccepted = cookie.isAccepted();

  $scope.accept = cookie.accept;

  $scope.$on('cookiesPolicyAccepted', () => {
    $scope.isAccepted = true;
  });
}]);