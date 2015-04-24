angular.module('nomLater.services', [])

.factory('Events', function($http, $rootScope) {

  var getEvents = function() {
    return $http({
      method: 'GET',
      url: '/api/events'
    }).then(function(res) {
      console.log(res.data)
      return res.data
    })
  };

  

  var joinEvent = function(event) {
      return $http({
        method: 'PUT',
        url: '/api/events', 
        data: {eventId: event._id, userInfo: $rootScope.userInfo}
      }).then(function (resp) {
        return resp.statusCode; 
      });
  };

  var addEvent = function(event) {
      var datetime = new Date(event.date + ' ' + event.time);
      var unix = datetime.getTime();
      event.datetime = unix;
      event.createdAt = new Date().getTime();
      return $http({
        method: 'POST',
        url: '/api/events',
        data: event
      }).then(function (res) {
        return res.data
      });
  };

  var deleteEvent = function(evnt) {
    return $http({
      method: 'DELETE',
      url: '/api/events',
      data: evnt
    }).then(function(res) {
      return res.data;
    })
  }

  var getUserInfo = function(){
    return $http({
      method: "GET",
      url: "/api/userinfo"
    }).then(function(x){
      $rootScope.userInfo.name = x.data.displayName;
      $rootScope.userInfo.id = x.data.googleId;
    })
  };

  return {
    getEvents : getEvents,
    joinEvent: joinEvent,
    addEvent : addEvent,
    deleteEvent: deleteEvent,
    getUserInfo : getUserInfo
  };

})
.factory('CalendarFactory', function(){
  /*----------------------THESE VARIABLES ARE HERE TEMPORARILY-------------------------------*/
  var CLIENT_ID = '211335492612-618pduc3omcj4rptt73svjba064gco3o.apps.googleusercontent.com';

  var SCOPES = ['https://www.googleapis.com/auth/calendar'];

  /*----------------------------------------------------------------------------------------*/


  var resource = {}
  var init = function(event, user){    
  console.log("Event", event);
  var eventTime = new Date(event.datetime);
  date = eventTime.toISOString()

  var twoHoursLater = new Date(eventTime.getTime() + (2*1000*60*60));
  twoHoursLater = twoHoursLater.toISOString();
  // setup event details
    resource = {
      "location": event.location,
      "summary": event.description,
      "start": {
        "dateTime": date //THIS HAS TO BE CHANGED TO EVENT TIME;
      },
      "end": {
        "dateTime": twoHoursLater //THIS HAS TO BE CHANGED TO ONE HOUR LATER;
      }
    };
    gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES,
      'immediate': true
    }, handleAuthResult);
  }

  var handleAuthResult = function(authResult) {
    if (authResult && !authResult.error) {
      loadCalendarApi();
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      // authorizeDiv.style.display = 'inline';
      //TODO NEED TO POST ANGULAR ALERT DIV HERE.
    }
  }

  function handleAuthClick(event) {
    gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult);
    return false;
  }


  var loadCalendarApi = function() {
    gapi.client.load('calendar', 'v3', function(){
      var request = gapi.client.calendar.events.insert({
        "calendarId": "primary", 
        "resource": resource
      })

      request.execute(function(resp){
        if(resp.status === 'confirmed'){
          console.log("event posted to my calendar");
        } else {
          console.log("there was a problem listing the event");
        }
      })
    });

  }

  return {
    startCalendar: init
  }
})

.filter('fromNow', function() {
    return function(dateString) {
      return moment(dateString).fromNow()
    };
  });
