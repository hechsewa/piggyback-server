console.log('server starting');

var events = require('events'); //for event emitting
var eventEmitter = new events.EventEmitter(); // Create an eventEmitter object

var express = require('express'); //import express into a var
var fs = require('fs'); //file system from npm

var app = express(); //execute express

var server = app.listen(3000, listening); //create a server

//listening on port 3000
function listening() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at ' + host + ':' + port);
}

//use this folder to host files
app.use(express.static('public'));

//for POST requests (later maybe)
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//create a json log every time a new request is sent
var eLog;
//json file to store events
function createLog(){
     eLog = { name: 'log created at '+new Date() };
     console.log('creating new event log');
  //return eLog;
}
createLog();

var eventCount = 0; //event from event emitter count

/********** UNCOMMENT IF YOU WANT EXTRA EVENTS *********************/

var listner = function listner(){
   console.log('Event came');
   //tutaj dodaj event do pliku json
   var evTime = new Date();
   eLog['eventer'+eventCount]='event no.'+eventCount+' at '+evTime;
   var json = JSON.stringify(eLog, null, 2);
   fs.writeFile('eventslog.json', json, 'utf8', finished);
   function finished(err) {
   console.log(json);
    }
   eventCount += 1;
}

eventEmitter.addListener('eventer', listner); //powiaz emitter z listnerem

function emitRandomEvents() {
    eventEmitter.emit('eventer');
    var delay = Math.floor((Math.random() * 10) + 1); //opoznienie losowe
    setTimeout(emitRandomEvents, delay*1000);
}
emitRandomEvents();

/* **************************************************************** */

function processEvents(eventCount){
  if(eventCount != 0){
    console.log(eventCount+' events received');
    //wczytaj eventy z jsona
  } else {
    console.log('no events');
  }
}

//iterator po obiekcie json: zwraca wartosc klucza
//DESIGN PATTERN: ITERATOR OVER JSON OBJECTS/JSON KEYS
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
  last: function() {
    return this.json[this.json.length-1];
  },
  prev: function() {
    return this.json[this.json.length-(this.index++)];
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

//PREPARE THE RESPONSE: zwraca obiekt json z eventami które zdarzyły się od czasu
//ostatniego requestu
var sLog;
function getYourResponse(cliId){
  sLog={};
  var searchLog = fs.readFileSync('eventslog.json');
  sLog = JSON.parse(searchLog);
  //console.log(sLog);
  var it = new Iterator(sLog);
  var result = {};
  //format to get the previous id
  var lastChar = Number(cliId.slice(-1));
  var prev = cliId.substring(0, cliId.length-1)+(lastChar-1);
  //console.log(prev);
  if(prev != false) {
      for (var item = it.get(prev); it.hasNext(); item=it.next()){
        if(item == prev){
          continue;
        } else {
          //console.log(item);
          result[item]=sLog[item];
        }
      }
  } else {
        for(var i = it.first(); it.hasNext(); item=it.next()){
          result[i]=sLog[i];
        }
  }
  result[cliId]='['+cliId+'] Request response';
  //console.log(result);
  return result;
}

//handle client requests (pushing a button)
//dodajemy nowy event po wcisnieciu przycisku
app.get('/add/:name/:id', addEvent);

var count = 0; //count button presses

//Handle that route
function addEvent(req, res) {
  var nameE = req.params.name + count; //dodajemy counter bo inaczej w logu sie nadpisze
  var clientId = req.params.id;
  console.log(clientId);
  var timeE = new Date();
  // Put it in the object
  var reply = {
    name: clientId,
    time: timeE
  }
  count += 1;
  eventCount += 1;
  eLog[clientId] = '['+clientId+'] Sent request at '+timeE;

  processEvents(eventCount);

  // Write a file each time we get a new word
  var json = JSON.stringify(eLog, null, 2);
  fs.writeFile('eventslog.json', json, 'utf8', finished);
  function finished(err) {
    var results = getYourResponse(clientId);
    res.send(results);
  }
}
