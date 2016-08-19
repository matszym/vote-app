angular.module('cookiesWarning')
.directive('cookiesWarning', () => {
  return {
    restrict: 'E',
    transclude: true,
    controller: 'CookiesWarningController',
    templateUrl: 'views/cookies-policy.client.view.html'
  }
});