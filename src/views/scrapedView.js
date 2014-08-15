var lib = require('./../lib/lib.js'),
	Data = require('./../models/data.js'),
	Locations = require('./../models/array.js'),
	DataView = require('./../views/dataView.js'),
	LocationView = require('./../views/arrayView.js'),
	Meta = require('./../models/meta.js'),
	MetaView = require('./../views/metaView.js');

var fs = require('fs');


module.exports = lib.Backbone.View.extend({

	initialize: function() {
		console.log('SCRAPED VIEW INSTANTIATED');
		this.render();
	},

	render: function() {
		var self = this;
	
		lib._.keys(this.model.attributes).forEach(function(k) {
			if (k !== 'hash' && self.model.attributes[k]) { 
				if (k === 'URL') {
					self.$el.append('<tr><td>' + k + '</td><td><a href="' + self.model.attributes[k].trim() + '">' +  self.model.attributes[k] + '</a></td></tr>');
				}
				else {
					self.$el.append('<tr><td>' + k + '</td><td>' + self.model.attributes[k] + '</td></tr>');
				}
			}
		})
	}

});
