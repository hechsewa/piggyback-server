
'use strict'
/** A module implementing piggback server including:
- Iterator for key attributes of JSON OBJECTS
- DAO Object for JSON files
-
**/

/**
 * Expose proper functions & objects
 */
module.exports = {piggyServer, processEvents, Iterator, Dao, emitRandomEvents, getYourResponse, getMethod, postMethod, clientGenerator};

/*MODULE IMPORTS */
var events = require('events'); //for event emitting
var eventEmitter = new events.EventEmitter(); // Create an eventEmitter object
var express = require('express'); //import express into a var
var fs = require('fs'); //file system from npm
var bodyParser = require('body-parser'); //for parsing POST requests

/* MODULE VARIABLES */
var app = express(); //init express
var eLog = {};
var eventCount = 0; //counts events
var sLog;
var count = 0; //counts number of requests from the same client
var dao;

/* Function piggyServer() @public
* creates a piggyback server and listens
* @params {Number} portno <-- port number
* @params {String} dirname <-- directory for hosting files
* @params {String} filename <-- event log path
*/
function piggyServer(portno, dirname, filename) {
  var server = app.listen(portno, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Piggyback server listening at '+host+":"+port);
  }); //create a server & listen

  //use this folder to host files
  app.use(express.static(dirname));
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  //create new log;
  dao = new Dao(filename);
  dao.createLog();
}


/* Function: getMethod(path) @public
*  handles route and prepares response
*  @params {String} path
*  path format needs to be: /:id/
*/
function getMethod(path) {
  app.get(path, getEvent);
}

/* Function: addEvent(request, response) @private
*  @params {String} req
*  @params {String} res
*
*/
function getEvent(req, res) {
  eventCount = 0;
  var client = req.params.id;
  var timer = new Date();
  //put event info in the object
  var reply = {
    name: client,
    time: timer
  }
  count += 1;
  eventCount += 1;
  eLog[client] = '['+client+'] Sent request at '+timer;
  // Write a file each time we get a new word
  dao.writeFile(eLog);
  var results = getYourResponse(client);
  processEvents(eventCount);
  res.send(results);
}


/* Function: postMethod(path) @public
*  handles post requests and prepares response
*  @params {String} path
*  @params {JSON} data
*/
function postMethod(path){
  app.post(path, postEvent);
}
/* Function: postEvent(request, response) @private
*  @params {String} req
*  @params {*} res
*
*/
function postEvent(req, res){
  var client = req.body.ident;
  var timer = new Date();
  //put event info in the object
  var reply = {
    name: client,
    time: timer
  }
  count += 1;
  eventCount += 1;
  eLog[client] = '['+client+'] Sent request at '+timer;
  // Write a file each time we get a new word
  dao.writeFile(eLog);
  var results = getYourResponse(client);
  processEvents(eventCount);
  res.send(results);
}

/*
* Function: processEvents
* check and display in console current events count
*
*/
function processEvents(eventCount){
  if(eventCount != 0){
    console.log(eventCount+' events received');
    //wczytaj eventy z jsona
  } else {
    console.log('no events');
  }
}

/*
* Iterator object over JSON object's keys
* @param  {JSON}  json
* Functions:
*   First() - returns first json key of the obejct
    @returns {String} key
*   Get(key) - searches the json object for the key and returns it
    @param {String} key
    @returns {String} value
*   Next() - returns the next value of key in json object
    @returns {String} key
*   hasNext() - returns true if json object has a next element, otherwise false
    @returns {Boolean} Bool
*   reset() - resets iterator index to the beginning (0)
*/
var Iterator = function(json){
  this.index = 0;
  var keys = [];
  for (var x in json){
    keys.push(x);
  }
  this.json = keys;
}

Iterator.prototype = {
  first: function() {
    this.reset();
    return this.next();
  },
  get : function(key) {
    var res;
    while(this.hasNext()){
      if(this.json[this.index]==key){
        res = this.json[this.index+1];
        break;
      } else res = false;
      this.index += 1;
    }
    return res;
  },
  next: function() {
    return this.json[this.index++];
  },
  hasNext: function() {
    return this.index <= this.json.length;
  },
  reset: function() {
    this.index = 0;
  }
}

/* Data Access Object for json file holding events log
* @param {String} filename
* Functions:
*   readFile() - reads the file and saves to json object
    @returns {JSON} sLog
*   writeFile() - saves text to a json file
*   createLog() - creates an empty json file for holding events
*/
var Dao = function(filename){
    this.filename = filename;
}

Dao.prototype = {
  readFile: function(sLog) {
    var searchLog = fs.readFileSync(this.filename);
    sLog = JSON.parse(searchLog);
    return sLog;
  },
  writeFile: function(logText) {
    var json = JSON.stringify(logText, null, 2);
    fs.writeFileSync(this.filename, json, 'utf8');
  },
  createLog: function() {
    var eLog = { name: 'log created at '+new Date() };
    eLog = JSON.stringify(eLog, null, 2);
    if (fs.existsSync(this.filename)) {
      fs.writeFileSync(this.filename, eLog, 'utf8');
    } else {
      console.log('[DAO] Creating new event log');
      fs.appendFile(this.filename, eLog, function (err) {
        if (err) throw err;
        console.log('[DAO] Event log created');
      });
    }
  }
}


/* @private event emitter listner
* listens for new 'fake' events and adds them to json file
* and increments event count
*/
var listner = function listner(){
  console.log('[simulator] Event came');
  var evTime = new Date();
  eLog['eventer'+eventCount]='event no.'+eventCount+' at '+evTime;
  dao.writeFile(eLog);
  function finished(err) {
  console.log(json);
   }
  eventCount += 1;
}
eventEmitter.addListener('eventer', listner); //connect listener with emitter

/* Function: emitRandomEvents()
/* emits extra,'fake' events for checking the server functionality
*/
function emitRandomEvents() {
   eventEmitter.emit('eventer');
   var delay = Math.floor((Math.random() * 10) + 1); //opoznienie losowe
   setTimeout(emitRandomEvents, delay*1000);
}

/* Function: getYourResponse(cliId)
*  prepares the piggyback response to client's request
*  @params {String} cliId
*  @returns {JSON} result
*  client id format: [char][char][char][number]
*/
function getYourResponse(cliId){
  sLog={}; //init sLog json object
  sLog=dao.readFile(); //get events for json file to json object

  var it = new Iterator(sLog); //new json iterator
  var result = {}; //init result json object

  //format to get the previous id
  var lastChar = Number(cliId.slice(-1));
  var prev = cliId.substring(0, cliId.length-1)+(lastChar-1);

  //iterate over the object and get the results starting from previous request until this one
  if(prev != false) {
      for (var item = it.get(prev); it.hasNext(); item=it.next()){
        if(item == prev){
          continue;
        } else {
          result[item]=sLog[item];
        }
      }
  } else {
        for(var i = it.first(); it.hasNext(); item=it.next()){
          result[i]=sLog[i];
        }
  }
  result[cliId]='['+cliId+'] Request response';
  return result;
}

/*Function: clientGenerator() @public
* generates client ids
* @returns {String} txt
*
*/
function clientGenerator() {
    var txt = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 3; i++)
      txt += possible.charAt(Math.floor(Math.random() * possible.length));
    return txt;
}
