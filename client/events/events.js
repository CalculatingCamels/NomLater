angular.module('nomLater.events', [])

.controller('EventsController', function ($http, $scope, $rootScope, $window, $location, Events, CalendarFactory, $timeout) {
  $scope.eventsList = [];
  $scope.invalid = false
  $scope.shown = false
  $scope.eventsLoaded = true;
  $scope.eventJoinError = false;
  $scope.eventJoinSuccess = false;
  $scope.eventAddSuccess = false;
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

  $scope.joinEvent = function(evt) {
    //dont add the user to the event if they are alreay apart of it. 
    console.log(evt);
    if(!containsUser($scope.userInfo.name, evt)){
      Events.joinEvent(evt);
      $scope.addSuccess();
      evt.attendees.push($scope.userInfo);
      CalendarFactory.startCalendar(evt);
    } else {
      $scope.eventError();
    }
  }

  $scope.addEvent = function() {
    
    if ($scope.newEvent.description !== "" &&
        $scope.newEvent.location !== "" &&
        $scope.newEvent.datetime !== "" ) {

          $scope.newEvent.attendees = [];
          $scope.newEvent.attendees.push({name: $scope.userInfo.name});
          $scope.invalid = false
          $scope.eventsList.push($scope.newEvent);

          var loc = $scope.newEvent.location;
          $scope.invalid = false

          openTable(loc, function(url){
            $scope.newEvent.reserve = url;
          }).then(function(x){
            return Events.addEvent($scope.newEvent)
          })
          .then(function(newEvent) {
            CalendarFactory.startCalendar($scope.newEvent);
            $scope.addSuccess();
            // $scope.viewAllEvents();
            $scope.initNewEventForm()
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

    $scope.eventsLoaded = true;
  }

  $scope.initNewEventForm = function() {
    $scope.newEvent = {}
    $scope.newEvent.description
    $scope.newEvent.location
    $scope.newEvent.time = (new Date()).toTimeString().substr(0,5)
    $scope.newEvent.date = new Date(new Date() + new Date().getTimezoneOffset()*60000).toISOString().substr(0,10)    
  }

  $scope.viewAllEvents = function() {
    $scope.eventsLoaded = false;

    Events.getEvents()
    .then(function(data) {
      $scope.eventsList = data;
      $scope.eventsLoaded = true;
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
      if(r.data.total_entries === 1) {
       cb(r.data.restaurants[0].mobile_reserve_url);
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
