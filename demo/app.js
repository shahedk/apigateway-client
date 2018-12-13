var restify = require('restify');
var apiGatewayClient = require('apigateway-client');

apiGatewayClient.init('https://data.elearning.club/api/isvalid/','demo')

function respond(req, res, next) {
  res.send('hello from demo. ' + new Date() );
  next();
}

var server = restify.createServer();
server.get('/', respond);

server.use(apiGatewayClient.validateApiKey);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});