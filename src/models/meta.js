//parent is record

var lib = require('./../lib/lib.js');

module.exports = lib.Backbone.Model.extend({
	
	initialize: function() {
		this.on('childUpdate', this.updateParent)
		this.on('change', this.updateParent)
	},

	defaults: {
		status: 'open',
		codedBy: '',
		workLog: []
	},

	updateParent: function() {
		this.get('parent').set('meta', lib._.chain(this.attributes).clone().omit('parent').value());
		this.get('parent').trigger('childUpdate');
	}

});