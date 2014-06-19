var lib = require('./../lib/lib.js'),
	record = require('./../models/record.js'),
	RecordView = require('./../views/recordView.js');

module.exports = lib.Backbone.Collection.extend({
	
	model: record,

	initialize: function() {

		this.url = 'http://localhost:8000/api/contracts';
		this.fetch({
			success:this.onFetch,
			error:this.onFetchError
		});

	},

	onFetch: function(collection) {
		
		var app;

		app = new RecordView ({
			model: collection.models[0],
			el: lib.$('#app')
		});

	},

	onFetchError: function() {
		throw new Error('Error fetching models');
	}

})