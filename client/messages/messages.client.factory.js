angular.module('messages')
.factory('messages', ['$rootScope', $rootScope => {
  return {
    handleErrors: err => {
      var messages = err.data.map(msg => {
        return {
          content: msg.content,
          class: `alert alert-${msg.type}`
        }
      });

      $rootScope.$broadcast('messages', messages);
    }
  }
}]);
