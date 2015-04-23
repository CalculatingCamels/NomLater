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

  var getUserInfo = function(){
    console.log("Fired")
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
    getUserInfo : getUserInfo
  };

})

.filter('fromNow', function() {
    return function(dateString) {
      return moment(dateString).fromNow()
    };
  });
