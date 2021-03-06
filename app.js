
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , about = require('./routes/about')
  , contact = require('./routes/contact')
  , users = require('./routes/users')
  , http = require('http')
  , path = require('path')
  , usersonline = require('usersonline');

var app = express();
var contentBlocks = require('contentblocks')({ app: app, host: 'red-ant.herokuapp.com', port: 80, pathFind: '/v1/nest/find?q={"@subject":"[id]"}', pathPost: '/v1/nest', pathPut: '/v1/nest/[id]', pathDelete: '/v1/nest/[id]' });

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('cdearlywithdrawalcalculator'));
  app.use(express.session());
  app.use(contentBlocks.render); // Place this line BEFORE app.use(app.router) as it needs to pre-render content.
  app.use(usersonline.logger); // Enable UsersOnline. 
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
	app.locals.pretty = true;
});

app.get('/', routes.index);
app.get('/about', about.index);
app.get('/contact', contact.index);
app.post('/contact', contact.send);
app.get('/users', users.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
