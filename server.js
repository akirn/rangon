'use strict';

var express = require('express');
var app = express();
//var mongoose = require('mongoose');

var db = require('./config/db');

var port = process.env.PORT || 5000;
// mongoose.connect(db.url);

app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
  });

require('./app/routes')(app);

app.listen(port);
console.log('Connected on port ' + port);
exports = module.exports = app;
