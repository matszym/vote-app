angular.module('authentication')
.factory('user', ['$http', $http => {
  function isAuthenticated() {
    return !angular.equals({}, user);
  }
  let user = {};

  return {
    loadUser: (scope) => {
      // check if user is cached 
      if(!isAuthenticated()) {
        $http.get('/auth/user')
        .then(res => {
          user = res.data;
          if (isAuthenticated()) {
            user.isAuthenticated = true;
          }
          scope.user = user;
        })
        .catch(err => {
          user = {
            isAuthenticated: false
          };
          throw err;
        });
      } else {
        scope.user = user;
      }
    },
    logOut: (scope) => {
      $http.get('/auth/logout')
      .then(() => {
        user = {
          isAuthenticated: false
        };
        scope.user = user;
      })
      .catch(err => {
        user = {
          isAuthenticated: false
        };
        scope.user = user;
        throw err;
      });
    }
  }
}]);
