var lib = require('./../lib/lib.js');

module.exports = lib.Backbone.Model.extend({

	initialize: function() {
		this.listenTo(this, 'change:value', this.updateCleanValue)
	},

	updateCleanValue: function() {
		if (this.get('value') !== '') {
			this.set('cleanValue', '');
		}
	}

})