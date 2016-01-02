var fs = require('fs');
var path = require('path');
var http = require('http');
var querystring = require('querystring');

// Build responses
var responses = {};
var dir = '../responses';
fs.readdirSync(path.join(__dirname, dir)).forEach(function(file) {
  var name = file.substr(0, file.length - 3);
  responses[name] = require(dir + '/' + name);
});

/**
 *
 */
function send(status, data) {
  var content = JSON.stringify(data) || '';
  this.writeHead(status, { 
    'Content-Type': 'application/json', 
    'Content-Length': content.length
  });
  this.write(content);
  this.end();
}

/**
 *
 */
function route(request, response) {
  var query = request.url.indexOf('?') + 1;
  RouteService.route({
    url: request.url,
    path: query ? request.url.substr(0, query - 1) : request.url,
    query: query ? querystring.parse(request.url.substr(query)) : {},
    method: request.method,
    body: request.body || {},
    headers: request.headers || {},
    end: request.connection.destroy,
    param: function(name) {
      return this.body[name] || this.query[name] || this.headers[name];
    }
  }, response);
}

module.exports = {

  server: null,

  /**
   *
   */
  start: function(port, done){
    if(this.server === null) {
      this.server = http.createServer(function(request, response) {

        // Attach responses
        for(var i in responses) {
          response[i] = function(data) {
            responses[i].call(response, data);
          };
        }

        response.send = send;
        response.req = request;
        if(request.method === 'POST' || request.method === 'PATCH' || request.method === 'PUT') {
          var body = '';
          request.on('data', function(data) {
            // Begin parsing body
            body += data;
            if(body.length > 1e6) {
              // Body is too large
              body = '';
              write.call(response, 413, false);
              request.connection.destroy();
            }
          });

          request.on('end', function() {
            request.body = JSON.parse(body);
            route(request, response);
          });
        } else {
          // Handle a GET, HEAD, or OPTIONS call
          route(request, response);
        }
      }).listen(port);

      this.server.listen({
        port: port,
        exclusive: false
      }, function() {
        Log('HTTP Server is active @ port ' + port);
        if(done) {
          done();
        }
      });
    } else if(done) {
      done();
    }
  }
};