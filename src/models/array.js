//parent is data

var lib = require('./../lib/lib.js');

module.exports = lib.Backbone.Model.extend({
	
	defaults: {
		originals: [],
		merge: []
	},

	initialize: function() {
		var self = this;
		console.log ('original parent', self.get('parent'));

		this.on('change', function() {
			var tempParentData = self.get('parent').attributes.data;
			tempParentData.arrays.merge = lib._.clone(self.get('merge'));
			tempParentData.arrays.originals = lib._.clone(self.get('originals'));
			self.get('parent').set('data', lib._.clone(tempParentData));
		})
	}

});