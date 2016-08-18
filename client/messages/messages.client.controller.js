angular.module('messages')
.controller('MessagesController', ['$scope', $scope => {
  $scope.message = [];

  $scope.$on('messages', (event, messages) => $scope.messages = messages);
  $scope.$on('$routeChangeStart', () => $scope.messages = []);
}]);
