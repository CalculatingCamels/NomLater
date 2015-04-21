var bcrypt = require('bcrypt-nodejs');
var q = require('q');
var jwt = require('jwt-simple');
var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
 
var app = express();
 
app.use(express.static('./client'));
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
var connectdb = function(cb){
  mongo.connect('mongodb://localhost:27017/nomlater', function(err, db){
    if(err) return console.log(err);
    console.log('connected to the db successfully');
    cb(db);
  });
};
 
 
app.post('/api/signin', function(req, res){
  //req.body.PARAM
  connectdb(function(db){
    res.status(200).json({'token':'shit'})
  });
});
 
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
  });
 
app.listen(process.env.PORT || 3000);
 
console.log('server listening on ' + (process.env.PORT || 3000));