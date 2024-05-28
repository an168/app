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

    // Choose the handler this request should go to. If one is not found use the notfound handler
    var choosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    };

    // Route the request to the handler specificed
    choosenHandler(data, function (statusCode, payload) {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload called back by the handler, or default to an empty object
      payload = typeof payload == "object" ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log("Returning this respponse: ", statusCode, payloadString);
    });

    // Send the response
    // res.end("Hello World\n");

    // console.log(
    //   "Request received on path: " + trimmedPath,
    //   "\nwith method: " + method,
    //   "\nand with these query string parameters: ",
    //   // queryStringObject,
    //   JSON.stringify(queryStringObject, null, 2),
    //   "\nand with these headers:\n ",
    //   headers,
    //   "\nand with these payload:\n ",
    //   buffer
    // );
  });
});

// Start the server, and have it listen on port 7777
server.listen(7777, function () {
  console.log("The server is listening on port 7777 now");
});

// Define the handler
var handlers = {};

// Sample handler
handlers.sample = function (data, callback) {
  // Callback a http status code, and a payload object
  callback(406, { name: "sample handler" });
};

// Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// Define a request router
var router = {
  sample: handlers.sample,
};
