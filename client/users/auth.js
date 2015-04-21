'use strict';

angular.module('nomLater.signup', ['ngRoute'])

.controller('SignUpCtrl', function ($scope, $window, $location, Users) {
  $scope.user = {};

  $scope.signedIn = function() {
    return !!$window.localStorage['com.corgi']
  };

  $scope.signout = function() {
    $window.localStorage.setItem('com.corgi','');
    $location.path('/signin');
  }

  $scope.signInButton = function() {
    auth2.grantOfflineAccess({'redirect_uri' : 'postmessage'}).then(function(resp) {
      Users.signin(resp)
        .then(function (token) {
          $window.localStorage.setItem('com.corgi', token);
          $location.path('/');
        })
        .catch(function(error) {
          console.log(error);
      });
    });
  }

});
