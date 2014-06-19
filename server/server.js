var hapiMedium = require('./../../hapi-medium'),
	MongoHandler = require('./../../hm-mongodb-handler'),
	handler = new MongoHandler('mongodb://localhost:27017/contracttest'),
	fs = require('fs'),
	routes,
	server;

routes = [
	{
		basePath: '/api',
		path: '/contracts',
		dao: handler
	}
]		

server = hapiMedium(routes, {
	url:'localhost',
	port: 8000
});

server.route({
	method:'GET',
	path: '/',
	handler: function( request, reply ) {
		fs.readFile('./index.html', function(err, data) {
			reply(data.toString());
		})
	}

})


server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
        directory: { path: './', listing: false, index: true }
    }
});

server.start();
console.log('Server listening on port 8000')