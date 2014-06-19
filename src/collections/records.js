var lib = require('./../lib/lib.js'),
	Record = require('./../models/record.js'),
	RecordView = require('./../views/recordView.js');

module.exports = lib.Backbone.Collection.extend({
	
	model: Record,

	initialize: function() {
		this.url = 'http://localhost:8000/api/contracts';
	}

})