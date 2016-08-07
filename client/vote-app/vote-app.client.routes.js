angular.module('vote-app')
.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
  $routeProvider
  .when('/', {
    templateUrl: 'views/all-polls.client.view.html'
  })
  .when('/new-poll', {
    templateUrl: 'views/new-poll.client.view.html'
  })
  .when('/my-polls', {
    templateUrl: 'views/my-polls.client.view.html'
  })
  .otherwise('/', {
    redirect: '/'
  });

  $locationProvider.html5Mode(true);
}]);
