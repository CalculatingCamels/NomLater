angular.module('nomLater.events', [])

.controller('EventsController', function ($scope, $rootScope, $window, $location, Events, CalendarFactory) {
  $rootScope.signedIn = true;
  $scope.event = {}
  $scope.eventsList = {}
  $scope.pageNumber = 0
  $scope.invalid = false

  $scope.joinEvent = function(evt) {
    $scope.event = evt;
    Events.joinEvent(evt, userToken);
  }

  $scope.addEvent = function() {
    if ($scope.newEvent.description !== "" &&
        $scope.newEvent.location !== "" &&
        $scope.newEvent.datetime !== "" ) {

          $scope.invalid = false

          Events.addEvent($scope.newEvent)
          .then(function(newEvent) {
            alert('Your event has been created: ', newEvent.description);
            $scope.viewAllEvents();
            $scope.initNewEventForm()
          });
    } else {
      $scope.invalid = true
    }     
  }

  $scope.initNewEventForm = function() {
    $scope.newEvent = {}
    $scope.newEvent.description
    $scope.newEvent.location
    $scope.newEvent.time = (new Date()).toTimeString().substr(0,5)
    $scope.newEvent.date = new Date(new Date() + new Date().getTimezoneOffset()*60000).toISOString().substr(0,10)    
  }

  $scope.viewAllEvents = function() {

    Events.getEvents($scope.pageNumber)
    .then(function(data) {
      $scope.eventsList = data;
    });

  };

  $scope.nextPage = function() {
    // need some way to limit how many pages people can go forward; it seems to get messed up if people 
    // navigate past where there are no more results to show.
    $scope.pageNumber++
    $scope.viewAllEvents()
  };
  
  $scope.prevPage = function() {

    if ($scope.pageNumber > 0) {
      $scope.pageNumber--
      $scope.viewAllEvents()
    }
    
  };

  $scope.calendar = function(){
    CalendarFactory.startCalendar();
  }
  
  $scope.viewAllEvents()
  $scope.initNewEventForm()
})
