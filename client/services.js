angular.module('nomLater.services', [])

.factory('Events', function($http) {
  // these factory functions can be tested in the console with the following syntax (and similar stuff):
  // var e = angular.element(document.body).injector().get('Events'); -> because the name of the factory is 'Events'
  // e.addEvent(newEv)
  // e.getEvents(1)
  
  // this function finds events with time greater than now (that's what Date.now is)...
  var getEvents = function(pageNum) {
    return $http({
      method: 'GET',
      url: '/api/events',
      params: {
        pageNum: pageNum
      }
    })
    .then(function(res) {
      console.log(res.data)
      return res.data
    })

  };

  var joinEvent = function(event) {
      return $http({
        method: 'PUT',
        url: '/api/events', 
        data: {event: event}
      })
      .then(function (resp) {
        return resp.statusCode; 
      });
  }  

  var addEvent = function(event) {
      var datetime = new Date(event.date + ' ' + event.time);
      var unix = datetime.getTime();
      event.datetime = unix;
      event.createdAt = new Date().getTime();
      return $http({
        method: 'POST',
        url: '/api/events',
        data: {
          event: event
        }
      })
      .then(function (res) {
        return res.data
      });
  }

  return {
    getEvents : getEvents,
    joinEvent: joinEvent,
    addEvent : addEvent
  }

})

/* This custom Angular filter should produce our datetime object in the "from now" format
popular in other apps */
  .filter('fromNow', function() {
    return function(dateString) {
      return moment(dateString).fromNow()
    };
  });
