/*
 * Primary file for the API
 *
 */

// Dependecies
var http = require("http");
const { StringDecoder } = require("string_decoder");
//const http = require('http');
var url = require("url");
var StringDecorder = require("string_decoder").StringDecoder;

// The server should respond to all requests with a string
var server = http.createServer(function (req, res) {
  // Get the URL and parse it
  var parseUrl = url.parse(req.url, true);

  // Get the path
  var path = parseUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  var queryStringObject = parseUrl.query;

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  // Get the headers as an object
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();
    // Send the response
    res.end("Hello World\n");

    // Log the request path
    console.log(
      "Request received on path: " + trimmedPath,
      "\nwith method: " + method,
      "\nand with these query string parameters: ",
      // queryStringObject,
      JSON.stringify(queryStringObject, null, 2),
      "\nand with these headers:\n ",
      headers,
      "\nand with these payload:\n ",
      buffer
    );
  });
});

// Start the server, and have it listen on port 7777
server.listen(7777, function () {
  console.log("The server is listening on port 7777 now");
});
