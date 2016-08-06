angular.module('navigation')
.directive('navigation', () => {
  return {
    templateUrl: 'views/header.client.view.html',
    restrict: 'E'
  }
});
