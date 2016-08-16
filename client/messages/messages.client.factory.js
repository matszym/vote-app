angular.module('messages')
.factory('messages', ['$rootScope', $rootScope => {
  return {
    handleErrors: err => {
      $rootScope.$broadcast('messages', err.data);
    }
  }
  
}]);
