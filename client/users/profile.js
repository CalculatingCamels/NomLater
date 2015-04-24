'use strict'

angular.module('nomLater', ['ngRoute'])

.controller('profileController', function($scope, $http, $rootScope, $routeParams, Events) {
  $scope.eventsList = [];

  $scope.viewAllEvents = function() {
    $scope.eventsLoaded = false;

    Events.getEvents($routeParams.user_id)
    .then(function(data) {
      $scope.eventsList = data;
      $scope.eventsLoaded = true;
    });

  };
  viewAllEvents();
});