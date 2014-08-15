//instantiated by appView
//has a record model
//instantiates a dataView 
//instantiates a data model which holds a reference to the record model

var lib = require('./../lib/lib.js'),
	Data = require('./../models/data.js'),
	Locations = require('./../models/array.js'),
	DataView = require('./../views/dataView.js'),
	LocationView = require('./../views/arrayView.js'),
	Meta = require('./../models/meta.js'),
	MetaView = require('./../views/metaView.js'),
	ScrapedView = require('./../views/scrapedView.js'),
	Scraped = require('./../models/scraped.js');

var fs = require('fs');


module.exports = lib.Backbone.View.extend({

	initialize: function() {
		this.template = lib._.template(fs.readFileSync('./src/templates/record.html').toString());
		console.log(this.model.attributes);
		this.render();
	},

	render: function() {
		
		var childModelData =  lib._.extend(this.model.get('data'), {parent: this.model}),
			tableView,
			locationView,
			locationsMerge,
			locationsOriginal,
			metadata,
			scraped,
			scrapedView;
		
		console.log('recordView is rendering');
		


		this.$el.html(this.template({}));

		scraped = this.model.get('scraped');
		
		scrapedView = new ScrapedView({
			el: this.$('#scraped'),
			model: new Scraped(scraped)
		});
		
		
		tableView = new DataView({
			model: new Data(childModelData),
			el: this.$('#table')
		});

		locationsMerge = this.model.get('data').arrays.merge.locations;
		locationsOriginal = this.model.get('data').arrays.originals.locations;

		locations = new LocationView({
			model: new Locations({
				originals:locationsOriginal,
				merge: locationsMerge,
				parent: this.model
			}),
			el: this.$('#locations')
		});

		metadata = lib._.clone(this.model.get('meta'));
		metadata = lib._.extend(metadata, {parent: this.model});

		metaView = new MetaView({
			model: new Meta(metadata),
			el: this.$('#meta')
		});

		metaView.render();

	}

});
