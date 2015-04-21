'use strict';

// Declare app level module which depends on views, and components
var nomLater = angular.module('nomLater', ['ngRoute','nomLater.services','nomLater.events','nomLater.signup']);

nomLater.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: '/events/eventsPage.html',
        controller: 'EventsController'
    }).
      when('/users/:user_id', {
        templateUrl: '/users/profile.html',
        controller: 'profileCtrl'
    }).
      when('/signup', {
        templateUrl: '/users/signup.html',
        controller: 'SignUpCtrl'
    }).
      when('/signin', {
        templateUrl: '/users/signin.html',
        controller: 'SignUpCtrl'
    }).otherwise({
        redirectTo: '/'
    });
}]);

