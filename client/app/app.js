'use strict';

// Declare app level module which depends on views, and components
var nomLater = angular.module('nomLater', ['ngRoute','nomLater.services','nomLater.events','nomLater.signup']);

nomLater.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {
        templateUrl: 'client/app/events/eventsPage.html',
        controller: 'EventsController'
    }).
      when('/users/:user_id', {
        templateUrl: 'client/app/users/profile.html',
        controller: 'profileCtrl'
    }).
      when('/signup', {
        templateUrl: 'client/app/users/signup.html',
        controller: 'SignUpCtrl'
    }).
      when('/signin', {
        templateUrl: 'client/app/users/signin.html',
        controller: 'SignUpCtrl'
    }).otherwise({
        redirectTo: '/'
    });
}]);

