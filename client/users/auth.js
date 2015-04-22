'use strict';

angular.module('nomLater.signup', ['ngRoute'])

.controller('Auth', function ($scope) {
  $scope.user = {};

  $scope.signout = function() {
    $location.path('/signin');
  }

});
