var lib = require('./../lib/lib.js');

//model assumes the {a:..., b:..., merge:..., arrays:...} structure used by the json-merge module

module.exports = lib.Backbone.Model.extend({

	idAttribute: '_id',
	
	urlRoot: 'http://0.0.0.0:8000/api/contracts',

	saveModel: function() {
		console.log('parent model has been saved');
		this.save({
			error: this.saveError
		});
	},

	initialize: function() {
		this.on('childUpdate', function() {
			console.log('record model updated');
			console.log(this.attributes);
			this.saveModel();
		})
	},

	saveError: function() {
		throw new Error ('Error saving model!');
	}

})