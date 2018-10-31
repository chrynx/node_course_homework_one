const http          = require('http');
const url           = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer(function(req,res){
    const URL           = url.parse(req.url, true);
    const path          = URL.pathname;
    const trimmedPath   = path.replace(/^\/+|\/+$/g, '');
    const qs            = URL.query;
    const decoder = new StringDecoder('utf-8');
    let buffer          = '';

    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function(){
        buffer += decoder.end();

        const route = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : routes.notFound;
        const data = {
            'trimmedPath': trimmedPath,
            'qs': qs,
            'buffer': buffer
        }

        route(data, function(statusCode, payload){

            statusCode  = typeof(statusCode) === 'number' ? statusCode : 200;
            payload     = typeof(payload) === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Request response: ', statusCode, payloadString);
        })
    });
});

server.listen(80, function(){
    console.log("The server is listening on port 80");
});

const routes = {};

routes.hello = function(data, callback){
  callback(200, {
      "welcome": "I was going to route this properly... BUT AM I GONNA?"
  });
};

routes.notFound = function(data, callback){
    callback(404);
};

const router = {
    'hello': routes.hello
};