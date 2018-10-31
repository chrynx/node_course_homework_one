/*
    A simple API that responds to /hello
 */
const http          = require('http');
const url           = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Creating a HTTP server
const server = http.createServer((req,res) => {

    // The URL of the request
    const URL           = url.parse(req.url, true);

    // The path e.g. -> /foo/bar <-
    const path          = URL.pathname;

    // Trimming outer slashes
    const trimmedPath   = path.replace(/^\/+|\/+$/g, '');

    // The query string that comes with the request
    const qs            = URL.query;

    // A decoder to be used for writing to the buffer
    const decoder = new StringDecoder('utf-8');

    // A string object that will gather all of the payload
    let buffer          = '';

    // As the request writes, we concat the buffer
    req.on('data', (data) => buffer += decoder.write(data));

    // The request ends
    req.on('end', () => {

        // We finalize the buffer
        buffer += decoder.end();

        // The route the user wants, default is notFound
        const route = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : routes.notFound;

        // The data to be included with the response
        const data = {
            trimmedPath,
            qs,
            buffer
        };

        // Handling the route
        route(data, (statusCode, payload) => {

            // The statusCode of the route, 200 as a default
            statusCode  = typeof(statusCode) === 'number' ? statusCode : 200;

            // The payload of the request, an empty object as a default
            payload     = typeof(payload) === 'object' ? payload : {};

            // We stringify the payload
            const payloadString = JSON.stringify(payload);

            // We let client end software know this is JSON
            res.setHeader('Content-Type', 'application/json');

            // We add the status code to the head of the response
            res.writeHead(statusCode);

            // We end the response with the payloadString
            res.end(payloadString);

            // Log the response of the request
            console.log('Request response: ', statusCode, payloadString);
        })
    });
});

// Make the server listen to any requests
server.listen(80, () => console.log("Server is listening on port 80"));

// The possible routes
const routes = {};

// /hello
routes.hello = (data, callback) => {
  callback(200, {
      "welcome": "I was going to route this properly... BUT AM I GONNA?"
  });
};

// /*
routes.notFound = (data, callback) => {
    callback(404);
};

// Our router with the routes inside
const router = {
    'hello': routes.hello
};