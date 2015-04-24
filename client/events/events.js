angular.module('nomLater.events', [])

.controller('EventsController', function ($http, $scope, $rootScope, $window, $location, Events, CalendarFactory, $timeout, $interval) {
  $scope.eventsList = [];
  $scope.invalid = false
  $scope.shown = false
  $scope.eventsLoaded = true;
  $scope.eventJoinError = false;
  $scope.eventJoinSuccess = false;
  $scope.eventAddSuccess = false;
  $scope.attendingEvent; 
  $scope.activeEventIndex;

  $scope.showForm = function() {
    $scope.shown = !$scope.shown;
  }

  $scope.showGuests = function(index) {
    $scope.activeEventIndex = index;
  }

  $scope.hideGuests = function(index) {
    $scope.activeEventIndex = null;
  }

  $scope.isShowing = function(index) {
    return $scope.activeEventIndex === index;
  }

  $scope.eventError = function() {
    console.log("eventError called!");
    $scope.eventJoinError = true;
    $timeout(function() {
      $scope.eventJoinError = false;
    }, 1500);
  }

  $scope.addSuccess = function() {
    $scope.eventAddSuccess = true;
    $timeout(function() {
      $scope.eventAddSuccess = false;
    }, 1000);
  }

  $scope.joinSuccess = function() {
    $scope.eventJoinSuccess = true;
    $timeout(function() {
      $scope.eventJoinSuccess;
    }, 1000);
  }

  $scope.isAttending = function(evnt) {
    for (var i=0; i < evnt.attendees.length; i++) {
      if (evnt.attendees[i].name === $scope.userInfo.name) {
        return true;
      }
    }
    return false; 
  }

  $scope.leaveEvent = function(evt) {
    // Will remove people from the google event and update the page
  }

  $scope.joinEvent = function(evt) {
    //dont add the user to the event if they are alreay apart of it. 
    if(!containsUser($scope.userInfo.name, evt)){
      Events.joinEvent(evt);
      CalendarFactory.startCalendar(evt);
      $scope.addSuccess();
      evt.attendees.push($scope.userInfo);
    } else {
      $scope.eventError();
    }
    $scope.attendingEvent = true;
  }

  $scope.addEvent = function() {
    debugger;
    if ($scope.newEvent.description !== "" &&
        $scope.newEvent.location !== "") {

          $scope.newEvent.attendees = [];
          $scope.newEvent.attendees.push({name: $scope.userInfo.name});
          $scope.eventsList.push($scope.newEvent);
          $scope.invalid = false

          var loc = $scope.newEvent.location;
          $scope.invalid = false

          openTable(loc, function(url){
            $scope.newEvent.reserve = url;
          }).then(function(x){
            return Events.addEvent($scope.newEvent)
          })
          .then(function(newEvent) {
            CalendarFactory.startCalendar($scope.newEvent);

            Events.getEvents()
            .then(function(data) {
              $scope.eventsList = data;
            });

            $scope.initNewEventForm();
            $scope.addSuccess();
          });

    } else {
      $scope.invalid = true
    }     
  }

  $scope.deleteEvent = function(evnt) {
    $scope.eventsLoaded = false;

    Events.deleteEvent(evnt)
    .then(function() {
      $scope.viewAllEvents();
    })

  }

  $scope.initNewEventForm = function() {
    console.log("HERE")
    $scope.newEvent = {}
    $scope.newEvent.time = new Date(new Date().toISOString().substr(0,16))
    $scope.newEvent.date = new Date()
    console.log("THERE")
  }

  $scope.viewAllEvents = function() {
    $scope.eventsLoaded = false;

    Events.getEvents()
    .then(function(data) {
      $scope.eventsList = data;
      $scope.eventsLoaded = true;
    });

    $interval(function() {
      Events.getEvents()
      .then(function(data) {
        $scope.eventsList = data;
      })
     }, 60000); 

  };

  $scope.initUser = function(){
    if(!$rootScope.userInfo){
      $rootScope.userInfo = {};
      Events.getUserInfo();
    }
  }

  function openTable(name, cb){
    return $http({
      method: "GET",
      url: "https://opentable.herokuapp.com/api/restaurants?city=Austin&name=" + name
    }).then(function(r){ 
      if(r.data.total_entries >= 1) {
       cb(r.data.restaurants[0].reserve_url);
      }   
    })
  }

  $scope.viewAllEvents()
  $scope.initNewEventForm()
  $scope.initUser()

   var containsUser = function(name, evnt){
      for(var i = 0; i < evnt.attendees.length; i++){
        if(evnt.attendees[i].name === name){
          return true;
        }
      }
      return false;
   };


})
