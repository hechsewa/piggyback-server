//A piggyback server for Nodejs

//Internal node modules
var http = require('http'); 
//Angular module
var app = angular.module("myShoppingList",[]);

//create a server object:
http.createServer(function (req, res) {
  res.write('Hello World!'); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080 

//module.exports.OutsideName = InternalName
