console.log('server starting');

var events = require('events'); //for event emitting
var eventEmitter = new events.EventEmitter(); // Create an eventEmitter object

var express = require('express'); //import express into a var
var app = express(); //execute express

var fs = require('fs'); //file system from npm

var server = app.listen(3000, listening); //create a server

//listening on port 3000
function listening() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at ' + host + ':' + port);
}

//use this folder to host files
app.use(express.static('public'));

//do POST requestow
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//TUTAJ KONFIGURACJA LOGA
var eLog;
//json file to store events
function createLog(){
     eLog = { name: 'log created at '+new Date() };
     console.log('creating new event log');
  //return eLog;
}

createLog();

var eventCount = 0;
//TUTAJ GENEROWANIE LOSOWYCH EVENTOW
var listner = function listner(){

   app.get('/', (req, res) =>
    res.setStatus(200));
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

function processEvents(eventCount){
  if(eventCount != 0){
    console.log(eventCount+' events received');
    //wczytaj eventy z jsona
  } else {
    console.log('no events');
  }
}

//TUTAJ ODSYLANIE ODPOWIEDZI NA SUBMIT
//dodajemy nowy event po wcisnieciu przycisku
app.get('/add/:name', addEvent);

var count = 0;
// Handle that route
function addEvent(req, res) {
  var nameE = req.params.name + count; //dodajemy counter bo inaczej w logu sie nadpisze
  var timeE = new Date();
  // Put it in the object
  var reply = {
    name: nameE,
    time: timeE
  }
  count = count+1;

  eLog[nameE] = 'Sent request at '+timeE;

  processEvents(eventCount);
  console.log('adding: ' + nameE + ":" +timeE);

  // Write a file each time we get a new word
  var json = JSON.stringify(eLog, null, 2);
  fs.writeFile('eventslog.json', json, 'utf8', finished);
  function finished(err) {
    //var reJson = fs.readFile('eventslog.json', 'utf8');
    console.log('Finished writing events');
    // Don't send anything back until everything is done
    createLog();
    res.send(json);
    eventCount=0;
  }
}
