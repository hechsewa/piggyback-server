
'use strict'
/** A module implementing piggback server including:
- Iterator for key attributes of JSON OBJECTS
- DAO Object for JSON files (keys)
- Factory method for preparing a response for both post and get request

/**
 * Expose proper functions & objects
 */
module.exports = {piggyServer, processEvents, emitRandomEvents, getYourResponse, handleReq, clientGenerator};
/*MODULE IMPORTS */
var events = require('events'); //for event emitting
var EventEmitter = new events.EventEmitter(); // Create an eventEmitter object
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
var clientCounterTab = {}; // indexes - id, values - counters of requests

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
  dao = new LogDao(filename);
  dao.createLog();
}

/* Function Factory() @private
*Factory function acts like a creator object
* function takeMethod(type, path)
*   takes type of method and an absolute path
*   @returns {*} methodApp
*/
function Factory() {
  this.takeMethod = function(type, path_){
    var path = path_;
    var methodApp;

    if (type=="get"){
      methodApp = new getMethod(path);
    } else if (type =="post"){
      methodApp = new postMethod(path);
    }

    //factory method: the same for both post and get requests
    methodApp.serveEvent = function(client, txt) {
      var timer = new Date();
      //put event info in the object
      var reply = {
        name: client,
        time: timer
      }
      count += 1;
      eventCount += 1;
      eLog[client] = txt;
      // Write a file each time we get a new word
      dao.writeFile(eLog);
      var results = getYourResponse(client, txt);
      processEvents(eventCount);
      return results;
    }

    return methodApp;
  }
}

/* Concrete Creators */
var getMethod = function(path) {
  this.path = path;
  this.method = 'get';
}

var postMethod = function(path){
  this.path = path;
  this.method = 'post';
}

/*Function handleReq() @public
*takes method type and a path and sends the server's response
* @param {String} type
* @param {String} path
*
*/
function handleReq(type, path) {
  //create a creator object for factory method handler
  var handler = new Factory().takeMethod(type, path);
  if(type=='get'){
    app.get(path, (req, res)=>{
      eventCount = 0;
      var client = req.params.id;
      var txt = req.params.txt;
      client = client+getRequestNumber(client);
      //use of factory method
      var rep = handler.serveEvent(client, txt);
      res.send(rep);
    });
  } else if (type=='post') {
    app.post(path, (req, res)=> {
      eventCount = 0;
      var client = req.body.ident;
      var txt = req.body.text;
      client = client+getRequestNumber(client);
      //use of factory method
      var rep = handler.serveEvent(client,txt);
      res.send(rep);
    });
  } else {
    console.log('Wrong method');
  }
}

/* Function getRequestNumber()
* Returns counter of request
*  @param {String} client
*  @returns {Integer}
*/
function getRequestNumber(client){
  if (!clientCounterTab[client]){
    clientCounterTab[client] = 1;
  }
  else {
    clientCounterTab[client]= clientCounterTab[client]+1;
  }
  return clientCounterTab[client];
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
class JsonIterator {
  constructor(json) {
    this.index = 0;
    var keys = [];
    for (var x in json){
      keys.push(x);
    }
    this.json = keys;
  }

  first() {
    this.reset();
    return this.next();
  }

  get(key) {
    var res;
    while(this.hasNext()){
      if(this.json[this.index]==key){
        res = this.json[this.index+1];
        break;
      } else res = false;
      this.index += 1;
    }
    return res;
  }

  next() {
    return this.json[this.index++];
  }

  hasNext() {
    return this.index <= this.json.length;
  }

  reset() {
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
class LogDao {
  constructor(filename) {
    this.filename = filename;
  }

  readFile(sLog){
    var searchLog = fs.readFileSync(this.filename);
    sLog = JSON.parse(searchLog);
    return sLog;
  }

  writeFile(logText) {
    var json = JSON.stringify(logText, null, 2);
    fs.writeFileSync(this.filename, json, 'utf8');
  }

  createLog() {
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
EventEmitter.addListener('eventer', listner);


/* Function: emitRandomEvents()
/* emits extra,'fake' events for checking the server functionality
*/
function emitRandomEvents(){
    EventEmitter.emit('eventer');
    var delay = Math.floor((Math.random() * 10) + 1); //opoznienie losowe
    setTimeout(emitRandomEvents, delay*1000);
}



/* Function: getYourResponse(cliId)
*  prepares the piggyback response to client's request
*  @params {String} cliId
*  @returns {JSON} result
*  client id format: [char][char][char][number]
*/
function getYourResponse(cliId, txt){
  sLog={}; //init sLog json object
  sLog=dao.readFile(); //get events for json file to json object

  let it = new JsonIterator(sLog); //new json iterator
  var result = {}; //init result json object

  //format to get the previous id
  var lastChar = Number(cliId.substring(3));
  var prev = cliId.substring(0,3)+(lastChar-1);

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
  result[cliId]=txt;
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
