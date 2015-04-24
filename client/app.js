'use strict';

// Declare app level module which depends on views, and components
var nomLater = angular.module('nomLater', ['ngRoute','nomLater.services','nomLater.events', 'ngFx', 'ngAnimate']);

nomLater.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: '/users/signin.html',
        authenticate: false
    }).
      when('/user/:user_id', {
        templateUrl: '/users/profile.html',
        controller: 'profileController',
        authenticate: true
    }).
      when('/events', {
        templateUrl: '/events/events.html',
        controller: 'EventsController',
        authenticate: true
    }).
      when('/events/:event_id', {
        templateUrl: '/events/event.html',
        controller: 'EventsController',
        authenticate: true
    }).
      otherwise({
        redirectTo: '/'
    });
}])
.run(function($rootScope, $location, globalAuth){
  $rootScope.$on('$routeChangeStart', function(event, next){
    $rootScope.path = $location.path();
    globalAuth.checkAuth().then(function(loggedIn){
      if(!loggedIn && next.$$route.authenticate){
        //not logged in and requires auth, redirect to homepage
        $location.path('/');
      } else if(loggedIn && $location.path() === '/'){
        //if loggedin
        $location.path('events');
      }
    });
  });
});

nomLater.factory('globalAuth', function($http){
  var checkAuth = function(){
    return $http({
      method: 'GET',
      url: '/api/auth'
    }).then(function(res){
      return JSON.parse(res.data);
    });
  };

  return {checkAuth: checkAuth};
})