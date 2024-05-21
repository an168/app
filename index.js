/*
* Primary file for the API
*
*/

// Dependecies
var http = require('http');
//const http = require('http');

// The server should respond to all requests with a string
var server = http.createServer(function(req,res){
    res.end('Hello World\n');
});

// Start the server, and have it listen on port 65535
server.listen(65535,function(){
    console.log("The server is listening on port 65535 now");
});