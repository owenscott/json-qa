//parent is data

var lib = require('./../lib/lib.js');

module.exports = lib.Backbone.Model.extend({

	initialize: function() {
		this.listenTo(this, 'change:value', this.updateCleanValue)
		this.listenTo(this, 'change', this.updateParent);
	},

	updateCleanValue: function() {
		if (this.get('value') !== '') {
			this.set('cleanValue', '');
		}
	},

	updateParent: function() {

		var tempKeyValuePairs = lib._.clone(this.get('parent').get('keyValuePairs'));
		var key = this.get('key');
		var newObject = lib._.omit(this.attributes, ['parent','key','sourceValues']);
		tempKeyValuePairs.merge[key] = lib._.clone(newObject);
		this.get('parent').set('keyValuePairs', tempKeyValuePairs);
		this.get('parent').trigger('childUpdate');

	}

})