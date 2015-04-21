var express = require('express');
var mongoose = require('mongoose');
var path = require('path');

var app = express();

app.use(express.static('./client'));

require('./middleware.js')(app, express);

app.listen((process.env.PORT || 3000));

console.log('server listening on ' + (process.env.PORT || 3000));