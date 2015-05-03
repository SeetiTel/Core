// server.js

// BASE SETUP
// =============================================================================
// call the packages we need
var express = require('express'), //main express
  app = express(), //build the engine
  multer = require('multer'), //parse json post data for express
  bodyParser = require('body-parser'), //body parser for other types of POST data
  cors = require('cors'), //make us API friendly
  request = require('request'), //basic HTTPS lib
  compression = require('compression'), //express compression
  basicAuth = require('basic-auth'), //lets us protect routes with HTTP Basic Auth

  sqlite3 = require('sqlite3').verbose(), //database
  chalk = require('chalk'), //pretty colors
  uuid = require('node-uuid'), //uuid creation for image uploads
  fs = require('fs'); //node's filesystem lib

var port = process.env.PORT || 8080, // set our port
  startTime = new Date(); // get our uptime

// GET THE DB UP AND RUNNING
// =============================================================================
var db = new sqlite3.Database('seeti.db'); //give the DB a file

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS whistles(created INTEGER, type INTEGER, value TEXT)");
});

// ROUTING
// =============================================================================
var router = express.Router(); //get an instance of the express Router
