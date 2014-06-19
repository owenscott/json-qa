var lib = require('./../lib/lib.js'),
	Record = require('./../models/record.js'),
	Row = require('./../models/row.js'),
	RowView = require('./../views/rowView.js'),
	Records = require('./../collections/records.js'),
	RecordView = require('./../views/recordView.js');

var	fs = require('fs');

module.exports = lib.Backbone.View.extend({

	collection: Records,
	
	initialize: function() {
		
		var self = this;

		this.collection.fetch({

			//had to inline success function in order to bind this properly
			success: function(collection) {

				var table,
					tableEl;

				tableEl = self.$('#table');

				table = new RecordView ({
					model: self.collection.models[0],
					el: tableEl
				});

				self.render();

			},

			error:this.onFetchError
		
		});

	},

	render: function() {
		//silence
	},
		

	onFetchError: function() {
		throw new Error('Error fetching models');
	}

});