console.log('server starting');

var express = require('express'); //import express into a var
var app = express(); //execute express

var fs = require('fs'); //file system from npm

var server = app.listen(3000, listening); //create a server

//listening on port 3000
function listening() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

//use this folder to host files
app.use(express.static('public'));

//do POST requestow
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var eLog;
//json file to store events
function loadEvents(){
  var exists = fs.existsSync('eventlog.json'); //check if already exists
  if (exists) {
    // Read the file & parse to object
   console.log('loading events');
   var txt = fs.readFileSync('eventslog.json', 'utf8');
   eLog = JSON.parse(txt);
   console.log('reading event log');
 }
  else {
     eLog = {
       "created log": new Date()
     };
     console.log('creating new event log');
  }
  //return eLog;
}

loadEvents();

//dodajemy nowy event po wcisnieciu przycisku
app.get('/add/:name', addEvent);

var count = 0;
// Handle that route
function addEvent(req, res) {
  var nameE = req.params.name + count; //dodajemy counter bo inaczej w logu sie nadpisze
  var timeE = new Date();
  // Put it in the object
  eLog[nameE] = timeE;
  count = count+1;

  var reply = {
    name: nameE,
    time: timeE
  }
  console.log('adding: ' + nameE + ":" +timeE);

  // Write a file each time we get a new word
  var json = JSON.stringify(eLog, null, 2);
  fs.writeFile('eventslog.json', json, 'utf8', finished);
  function finished(err) {
    console.log('Finished writing events');
    // Don't send anything back until everything is done
    res.send(reply);
  }
}
