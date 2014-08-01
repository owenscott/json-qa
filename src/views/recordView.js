//instantiated by appView
//has a record model
//instantiates a dataView 
//instantiates a data model which holds a reference to the record model

var lib = require('./../lib/lib.js'),
	Data = require('./../models/data.js'),
	Locations = require('./../models/array.js'),
	DataView = require('./../views/dataView.js'),
	LocationView = require('./../views/arrayView.js');

var fs = require('fs');


module.exports = lib.Backbone.View.extend({

	initialize: function() {
		this.template = lib._.template(fs.readFileSync('./src/templates/record.html').toString());
		this.render();
	},

	render: function() {
		
		var childModelData =  lib._.extend(this.model.get('data'), {parent: this.model}),
			tableView,
			locationView,
			locationsMerge,
			locationsOriginal;

		this.$el.html(this.template({}));

		// tableView = new DataView({
		// 	model: new Data(childModelData),
		// 	el: this.$('#table')
		// });

		locationsMerge = this.model.get('data').arrays.merge.locations;
		locationsOriginal = this.model.get('data').arrays.originals.locations;

		locations = new LocationView({
			model: new Locations({
				originals:locationsOriginal,
				merge: locationsMerge
			}),
			el: this.$('#locations')
		});

	}

});
