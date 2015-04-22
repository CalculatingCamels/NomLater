'use strict';

// Declare app level module which depends on views, and components
var nomLater = angular.module('nomLater', ['ngRoute','nomLater.services','nomLater.events','nomLater.signup']);

nomLater.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: '/users/signin.html'
    }).
      when('/users/:user_id', {
        templateUrl: '/users/profile.html',
        controller: 'profileCtrl'
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

