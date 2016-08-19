angular.module('cookiesWarning')
.factory('cookie', ['$rootScope', '$cookies', ($rootScope, $cookies) => {
  return {
    isAccepted: () => !!$cookies.get('cookiesPolicyAccepted'),
    accept: () => {
      $cookies.put('cookiesPolicyAccepted', true);
      $rootScope.$broadcast('cookiesPolicyAccepted');
    }
  }
}]);