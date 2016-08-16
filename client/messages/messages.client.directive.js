angular.module('messages')
.directive('messages', () => {
  return {
    templateUrl: 'views/messages.client.view.html',
    restrict: 'E'
  }
});
