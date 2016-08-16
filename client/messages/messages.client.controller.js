angular.module('messages')
.controller('MessagesController', ['$scope', $scope => {
  $scope.message = [];

  $scope.$on('messages', messages => {
    $scope.messages = messages;
  });
}]);
