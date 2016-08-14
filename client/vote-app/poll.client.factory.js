angular.module('vote-app')
.factory('poll', ['$http', '$location', '$routeParams', ($http, $location, $routeParams) => {
  function transform(obj) {
    let options = obj.data.options.map(option => {
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
      title: obj.data.title,
      labels: obj.data.options,
      selectBoxOptions: options,
      options: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      data: obj.data.votes,
      owner: obj.data.owner
    }
  }

  return {
    getPolls: (scope, query) => {
      $http.get(`api/polls/?limit=${query.limit}&offset=${query.offset}&time=${Date.now()}`)
      .then(response => {
        if (scope.polls && scope.query.time - response.data.time > 0) {
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
    getPoll: scope => {
      $http.get(`/api/poll/${$routeParams.id}`)
      .then(result => {


        scope.poll = transform(result);
      })
      .catch(err => {
        throw err;
      });
    },
    deletePoll: id => {
      $http.delete(`/api/poll/${$routeparams.id}`)
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
        scope.poll = transform(result);
      })
      .catch(err => {
        throw err;
      });
    }
  }
}]);
