var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var q = require('q');
var jwt = require('jwt-simple');
var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var passport = require('passport'), GoogleStrategy = require('passport-google-oauth2').Strategy;
var MongoStore = require('connect-mongo')(session);

var app = express();
 
app.use(express.static('./client'));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({ 
  secret: 'nomlater',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({url: 'mongodb://localhost:27017/nomlater'})
}));

app.use(passport.initialize());
app.use(passport.session());

var connectdb = function(cb){
  mongo.connect('mongodb://localhost:27017/nomlater', function(err, db){
    if(err) return console.log(err);
    console.log('connected to the db successfully');
    cb(db);
  });
};

passport.serializeUser(function(user, done) {
  console.log('serialize user object', user);
  connectdb(function(db){
    db.collection('users').find({googleId: user.id}).toArray(function (err, result) {
      if(result.length === 0){
        //User isn't in the database yet (FIRST TIMER!)
        //Insert data is the first thing stored for users
        var insertData = [{googleId: user.id, displayName: user.displayName}]
        db.collection('users').insert(insertData, function(err, result){
          done(null, insertData)
        });
      } else {
        //User is already in the database, just return their data
        done(null, result);
      }
    });
  });
});

passport.deserializeUser(function(obj, done) {
  console.log('deserialize user object', obj);
  connectdb(function(db){
    db.collection('users').find({googleId: obj.id}).toArray(function (err, result) {
      done(null, obj);
    });
  });
});

passport.use(new GoogleStrategy({
    clientID: '1018800213856-k8g9toetpgsti0k09jt035cf0hou6har.apps.googleusercontent.com',
    clientSecret: 'sOSsJEp1p6xMx-CBY7xtfvCQ',
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile);
    return done(null, profile);
  }
));

app.get('/api/auth', function(req, res){
  res.status(200).json(req.isAuthenticated());
})

app.get('/api/userinfo', function(req, res){
  res.status(200).json(req.session.passport.user[0]);
})

app.get('/auth/google', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/userinfo.profile']}));

app.get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/#/events', failureRedirect: '/'}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


/*
  EXAMPLE EVENT SCHEMA (COPIED FROM OLD CODE):
  eventID : { type: Number, ref: 'eventID'},
  description : String,
  location : String,
  datetime: Date,
  creatorID : Number,
  attendeeIDs : []
*/

//NONE OF THIS WORKS JUST YET:
app.route('/api/events')
  .get(function(req, res){
    connectdb(function(db){
      db.collection('events').find({'datetime': {$gt:(new Date()).toISOString()}}).sort({'datetime' : 1}).toArray(function(err, docs){
        db.close();
        res.status(200).send(JSON.stringify(docs));
      })
    })
  })
  .post(function(req, res){
    connectdb(function(db){
      db.collection('events').insert([], function(err, result){
        db.close();
        res.status(200).send(JSON.stringify(docs));
      })
    })
  })
  .put(function(req, res){
    //add a User's ID to the EVENT row
    //EVENTS HAVE MANY USERS
  });
 
app.listen(process.env.PORT || 3000);
 
console.log('server listening on ' + (process.env.PORT || 3000));