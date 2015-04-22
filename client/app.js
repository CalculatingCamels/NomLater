'use strict';

// Declare app level module which depends on views, and components
var nomLater = angular.module('nomLater', ['ngRoute','nomLater.services','nomLater.events']);

nomLater.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: '/users/signin.html',
        controller: 'SignInController'
    }).
      when('/users/:user_id', {
        templateUrl: '/users/profile.html',
        controller: 'ProfileCtrl'
    }).
      when('/events', {
        templateUrl: '/events/events.html',
        controller: 'EventsController'
    }).
      when('/events/:event_id', {
        templateUrl: '/events/event.html',
        controller: 'EventsController'
    }).
      otherwise({
        redirectTo: '/'
    });
}]);

nomLater.controller('menuBar', function($scope, $http, $location, globalAuth){
  globalAuth.checkAuth().then(function(data){
    $scope.isLoggedIn = data;
    if(data && $location.path() === '/'){
      $location.path('/events')
    }
  });
});

nomLater.factory('globalAuth', function($http){
  var checkAuth = function(){
    var test;
    return $http({
      method: 'GET',
      url: '/api/auth'
    }).then(function(res){
      return JSON.parse(res.data);
    });
  };

  return {checkAuth: checkAuth};
})