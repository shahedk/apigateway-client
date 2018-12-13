var restify = require('restify');
var apiKeyValidator = require('apigateway-client')
                        .configure('https://data.elearning.club','demo');


function respond(req, res, next) {
  res.send('hello from demo. ' + new Date() );
  next();
}

var server = restify.createServer();
server.get('/', respond);
server.get('/test', respond);
server.get('/test/:name', respond);

server.use(apiKeyValidator);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});