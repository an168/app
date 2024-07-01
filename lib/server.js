/*
 * Server-related tasks
 *
 */

// Dependecies
var http = require("http");
//const http = require('http');
var https = require("https");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");
var fs = require("fs");
var handlers = require("./handlers");
var helpers = require("./helpers");
var path = require("path");
var util = require("util");
var debug = util.debuglog("server");

// Initantiate the server module object
var server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer(function (req, res) {
  server.unifiedServer(req, res);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem")),
};

server.httpsServer = https.createServer(
  server.httpsServerOptions,
  function (req, res) {
    server.unifiedServer(req, res);
  }
);

// All the function for both the http and https Server
server.unifiedServer = function (req, res) {
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
      typeof server.router[trimmedPath] !== "undefined"
        ? server.router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: helpers.parseJsonToObject(buffer),
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
      //console.log("Returning this respponse: ", statusCode, payloadString);
      // If the response is 200, print green otherwise print red
      if (statusCode == 200) {
        debug(
          "\x1b[32m%s\x1b[0m", // 32:green
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      } else {
        debug(
          "\x1b[31m%s\x1b[0m", // 31:red
          method.toUpperCase() + " /" + trimmedPath + " " + statusCode
        );
      }
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
};

// Define a request router
server.router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  checks: handlers.checks,
};

// Init script
server.init = function () {
  // Start the HTTP server
  server.httpServer.listen(config.httpPort, function () {
    console.log(
      "\x1b[36m%s\x1b[0m", // 36:light blue
      "The server is listening on port " +
        config.httpPort +
        " in " +
        config.envName +
        " mode"
    );
  });
  // Start the HTTPS server
  // Start the HTTPS server
  server.httpsServer.listen(config.httpsPort, function () {
    console.log(
      "\x1b[35m%s\x1b[0m", // 35:pink
      "The server is listening on port " +
        config.httpsPort +
        " in " +
        config.envName +
        " mode"
    );
  });
};

// Export the module
module.exports = server;
