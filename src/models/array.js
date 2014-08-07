//parent is record

var lib = require('./../lib/lib.js');

module.exports = lib.Backbone.Model.extend({
	
	initialize: function() {
		this.on('updateParent', this.updateParent);
	},

	updateParent: function() {
		console.log('array model updated')
		var tempData = lib._.omit(this.get('parent').get('data'),'parent');
		console.log(JSON.stringify(tempData.arrays));
		tempData.arrays.merge.locations = this.get('merge');
		tempData.arrays.originals.locations = this.get('originals');
		this.get('parent').set('data', lib._.clone(tempData));
		this.get('parent').trigger('childUpdate');
		
	}

});