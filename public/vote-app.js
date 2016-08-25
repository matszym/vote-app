'use strict';

angular.module('authentication', []);
angular.module('cookiesWarning', ['ngCookies']);
angular.module('messages', []);
angular.module('navigation', ['authentication']);
angular.module('vote-app', ['chart.js', 'navigation', 'authentication', 'ngRoute', 'messages', 'cookiesWarning', 'btford.socket-io']);

angular.module('authentication').controller('AuthenticationController', ['$scope', 'user', function ($scope, user) {
  $scope.auth = {};
  user.loadUser($scope.auth);

  $scope.logOut = function () {
    user.logOut.bind(null, $scope.auth)();
    console.log($scope.auth);
  };
}]);
angular.module('authentication').factory('user', ['$http', '$rootScope', function ($http, $rootScope) {
  function isAuthenticated() {
    return !angular.equals({}, user);
  }
  var user = {};

  return {
    loadUser: function loadUser(scope) {
      // check if user is cached 
      if (!isAuthenticated()) {
        $http.get('/auth/user').then(function (res) {
          user = res.data;
          if (isAuthenticated()) {
            user.isAuthenticated = true;
          }
          $rootScope.$broadcast('user', user);
          scope.user = user;
        }).catch(function (err) {
          user = {
            isAuthenticated: false
          };
          throw err;
        });
      } else {
        scope.user = user;
      }
    },
    getUser: function getUser() {
      return user;
    },
    logOut: function logOut(scope) {
      $http.get('/auth/logout').then(function () {
        user = {
          isAuthenticated: false
        };
        scope.user = user;
        $rootScope.$broadcast('user', user);
      }).catch(function (err) {
        user = {
          isAuthenticated: false
        };
        scope.user = user;
        throw err;
      });
    }
  };
}]);

angular.module('cookiesWarning').factory('cookie', ['$rootScope', '$cookies', function ($rootScope, $cookies) {
  return {
    isAccepted: function isAccepted() {
      return !!$cookies.get('cookiesPolicyAccepted');
    },
    accept: function accept() {
      $cookies.put('cookiesPolicyAccepted', true);
      $rootScope.$broadcast('cookiesPolicyAccepted');
    }
  };
}]);
angular.module('cookiesWarning').directive('cookiesWarning', function () {
  return {
    restrict: 'E',
    transclude: true,
    controller: 'CookiesWarningController',
    templateUrl: 'views/cookies-policy.client.view.html'
  };
});
angular.module('cookiesWarning').controller('CookiesWarningController', ['$scope', 'cookie', function ($scope, cookie) {
  $scope.isAccepted = cookie.isAccepted();

  $scope.accept = cookie.accept;

  $scope.$on('cookiesPolicyAccepted', function () {
    $scope.isAccepted = true;
  });
}]);
angular.module('messages').controller('MessagesController', ['$scope', function ($scope) {
  $scope.message = [];

  $scope.$on('messages', function (event, messages) {
    return $scope.messages = messages;
  });
  $scope.$on('$routeChangeStart', function () {
    return $scope.messages = [];
  });
}]);

angular.module('messages').directive('messages', function () {
  return {
    templateUrl: 'views/messages.client.view.html',
    restrict: 'E'
  };
});

angular.module('messages').factory('messages', ['$rootScope', function ($rootScope) {
  return {
    handleErrors: function handleErrors(err) {
      var messages = err.data.map(function (msg) {
        return {
          content: msg.content,
          class: 'alert alert-' + msg.type
        };
      });

      $rootScope.$broadcast('messages', messages);
    }
  };
}]);

angular.module('navigation').controller('NavigationController', ['$scope', '$window', function ($scope, $window) {
  $scope.twitterAuth = function () {
    return $window.location.assign('/auth/twitter');
  };
}]);

angular.module('navigation').directive('navigation', function () {
  return {
    templateUrl: 'views/header.client.view.html',
    restrict: 'E'
  };
});

angular.module('vote-app').controller('AllPollsController', ['$scope', 'poll', '$attrs', 'user', function ($scope, poll, $attrs, auth) {
  var user = auth.getUser();
  $scope.queryParam = {};

  if ($attrs.hasOwnProperty('ownerOnly')) {
    $scope.queryParam._creator = user._id;
  }

  poll.getPolls($scope, {
    limit: 10,
    offset: 0
  });

  $scope.getPolls = poll.getPolls.bind(null, $scope);
}]);

angular.module('vote-app').directive('allPolls', function () {
  return {
    controller: "AllPollsController",
    templateUrl: 'views/all-polls.client.view.html'
  };
});
angular.module('vote-app').controller('ChartController', ['$scope', 'poll', 'user', 'socketFactory', '$routeParams', function ($scope, poll, user, socketFactory, $routeParams) {
  $scope.user = user.getUser();
  $scope.vote = "";

  poll.getPoll().then(function (result) {
    $scope.poll = poll.transform(result.data);

    // we can join the socket.io namespace now
    var ioSocket = io.connect('/' + $routeParams.id),
        mySocket = socketFactory({ ioSocket: ioSocket });

    mySocket.on('chartUpdate', function (data) {
      $scope.poll = poll.transform(data);
    });
  });

  $scope.votePoll = poll.votePoll.bind(null, $scope);
  $scope.deletePoll = poll.deletePoll;

  $scope.$on('user', function (event, user) {
    $scope.user = user;
  });
}]);
angular.module('vote-app').controller('PollController', ['poll', '$scope', function (poll, $scope) {
  $scope.poll = {
    title: '',
    options: ''
  };

  $scope.createPoll = poll.createPoll;
}]);
angular.module('vote-app').factory('poll', ['$http', '$location', '$routeParams', 'messages', function ($http, $location, $routeParams, messages) {
  var factory = {
    transform: function transform(data) {
      var options = data.options.map(function (option) {
        return {
          label: option,
          value: option
        };
      });

      options.push({
        label: "I'd like custom option",
        value: null
      });
      return {
        title: data.title,
        labels: data.options,
        selectBoxOptions: options,
        options: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        data: data.votes,
        owner: data.owner
      };
    },
    getPolls: function getPolls(scope, query) {
      var uri = 'api/polls/?limit=' + query.limit + '&offset=' + query.offset + '&time=' + Date.now();

      if (scope.queryParam._creator) {
        uri += '&user=' + scope.queryParam._creator;
      }

      $http.get(uri).then(function (response) {
        if (scope.polls && scope.query && scope.query.time - response.data.time > 0) {
          console.log('Ignoring old request');
          return;
        }
        scope.polls = response.data.polls;
        scope.query = response.data.query;
        scope.range = [];
        for (var i = 0; i < response.data.query.count; i += 10) {
          scope.range.push({
            query: {
              limit: 10,
              offset: i
            }
          });
        }
      }).catch(function (err) {
        throw err;
      });
    },
    createPoll: function createPoll(poll) {
      $http.post('api/poll', {
        title: poll.title,
        options: poll.options.split('\n')
      }).then(function (response) {
        $location.path('/poll/' + response.data._id);
      }).catch(function (err) {
        throw err;
      });
    },
    getPoll: function getPoll() {
      return $http.get('/api/poll/' + $routeParams.id).catch(function (err) {
        throw err;
      });
    },
    deletePoll: function deletePoll(id) {
      $http.delete('/api/poll/' + $routeParams.id).then(function (result) {
        $location.path('/my-polls');
      }).catch(function (err) {
        throw err;
      });
    },
    votePoll: function votePoll(scope) {
      var vote = "";

      if (scope.vote === null) {
        vote = scope.customOption || "";
      } else {
        vote = scope.vote;
      }

      $http.put('/api/poll/' + $routeParams.id, { vote: vote }).then(function (result) {
        scope.poll = factory.transform(result.data);
      }).catch(messages.handleErrors);
    }
  };

  return factory;
}]);

angular.module('vote-app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/polls.client.view.html'
  }).when('/new-poll', {
    templateUrl: 'views/new-poll.client.view.html'
  }).when('/my-polls', {
    templateUrl: 'views/my-polls.client.view.html'
  }).when('/poll/:id', {
    templateUrl: 'views/poll.client.view.html'
  }).otherwise('/', {
    redirect: '/'
  });

  $locationProvider.html5Mode(true);
}]);
//# sourceMappingURL=vote-app.js.map
