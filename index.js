/*
 * Primary file for the API
 *
 */

// Dependecies
var http = require("http");
//const http = require('http');
var url = require("url");

// The server should respond to all requests with a string
var server = http.createServer(function (req, res) {
  // Get the URL and parse it
  var parseUrl = url.parse(req.url, true);

  // Get the path
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Send the response
  res.end("Hello World\n");

  // Log the request path
  console.log(
    "Request received on path: " + trimmedPath + " with method: " + method
  );
});

// Start the server, and have it listen on port 65535
server.listen(65535, function () {
  console.log("The server is listening on port 65535 now");
});
