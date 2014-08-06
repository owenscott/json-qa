//parent is record

var lib = require('./../lib/lib.js');

module.exports = lib.Backbone.Model.extend({
	
	initialize: function() {
		this.on('childUpdate', this.updateParent)
	},

	updateParent: function() {
		console.log('data model updated')
		var tempData = lib._.omit(this.get('parent').get('data'),'parent');
		tempData.arrays = lib._.clone(this.get('arrays'));
		tempData.keyValuePairs = lib._.clone(this.get('keyValuePairs'));
		this.get('parent').set('data', lib._.clone(tempData));
		//TODO: actually do the update!
		this.get('parent').trigger('childUpdate');
		
	}

});