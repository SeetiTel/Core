// server.js

// BASE SETUP
// =============================================================================
// call the packages we need
var fs = require('fs'), //node's filesystem lib
  express = require('express'), //main express
  app = express(), //build the engine
  multer = require('multer'), //parse json post data for express
  bodyParser = require('bodyParser'), //body parser for other types of POST data
  cors = require('cors'), //make us API friendly
  sqlite3 = require('sqlite3').verbose(), //database
  basicAuth = require('basic-auth'), //lets us protect routes with HTTP Basic Auth
  chalk = require('chalk'), //pretty colors
  uuid = require('node-uuid'), //uuid creation for image uploads
  request = require('request'); //basic HTTPS lib

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
