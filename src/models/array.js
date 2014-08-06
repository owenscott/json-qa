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
			console.log('weeeeeee');
			var tempParentData = self.get('parent').attributes.data;
			tempParentData.arrays.merge = lib._.clone(self.get('merge'));
			tempParentData.arrays.originals = lib._.clone(self.get('originals'));
			console.log('right before updating', self.get('parent'));
			self.get('parent').set('data', lib._.clone(tempParentData));
			console.log('right after updating', self.get('parent'));
			console.log('done updating');
		})

		this.get('parent').on('change', function() {
			console.log('child heard parent change')
		})

	}

});