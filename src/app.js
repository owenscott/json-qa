var Records = require('./collections/records.js'),
	RecordView = require('./views/recordView.js'),
	AppView = require('./views/appView.js'),
	$ = require('jquery'),
	Backbone = require('backbone'),
	appView;


$(document).ready(function() {




	var Router = Backbone.Router.extend({
		routes: {
			'contracts/:id': 'displayContract',
			'*p': 'other'
		}
	});

	var router = new Router();

	router.on('route:displayContract', function(id) {
		console.log('content route');
		appView.setactiveModelIndex((+id)-1);
	})

	router.on('route:other', function() {
		console.log('other route');
		appView.setactiveModelIndex(0)
	})

	var appView = new AppView({
		el:'#app',
		collection: new Records()
	})

	appView.router = router;

	Backbone.history.start();



})




