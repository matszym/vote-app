angular.module('vote-app')
.factory('poll', ['$http', '$location', '$routeParams', 'messages', ($http, $location, $routeParams, messages) => {
  const factory = {
    transform: data => {
      let options = data.options.map(option => {
        return {
          label: option,
          value: option
        }
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
      }
    },
    getPolls: (scope, query) => {
      let uri = `api/polls/?limit=${query.limit}&offset=${query.offset}&time=${Date.now()}`;

      if (scope.queryParam._creator) {
        uri += `&user=${scope.queryParam._creator}`;
      }

      $http.get(uri)
      .then(response => {
        if (scope.polls && scope.query && scope.query.time - response.data.time > 0) {
          console.log('Ignoring old request');
          return;
        }
        scope.polls = response.data.polls;
        scope.query = response.data.query;
        scope.range = [];
        for (let i = 0; i < response.data.query.count; i += 10) {
          scope.range.push({
            query: {
              limit: 10,
              offset: i
            }
          });
        }
      })
      .catch(err => {
        throw err;
      });
    },
    createPoll: poll => {
      $http.post('api/poll', {
        title: poll.title,
        options: poll.options.split('\n')
      })
      .then(response => {
        $location.path(`/poll/${response.data._id}`);
      })
      .catch(err => {
        throw err;
      });
    },
    getPoll: () => {
      return $http.get(`/api/poll/${$routeParams.id}`)
      .catch(err => {
        throw err;
      });
    },
    deletePoll: id => {
      $http.delete(`/api/poll/${$routeParams.id}`)
      .then(result => {
        $location.path('/my-polls');
      })
      .catch(err => {
        throw err;
      })
    },
    votePoll: scope => {
      let vote = "";
      
      if (scope.vote === null) {
        vote = scope.customOption || "";
      } else {
        vote = scope.vote;
      }

      $http.put(`/api/poll/${$routeParams.id}`, { vote })
      .then(result => {
        scope.poll = factory.transform(result.data);
      })
      .catch(messages.handleErrors);
    }
  }

  return factory;
}]);
