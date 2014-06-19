var lib = require('./../lib/lib.js');



//model assumes the {a:..., b:..., merge:..., arrays:...} structure used by the json-merge module

module.exports = lib.Backbone.Model.extend({

	idAttribute: '_id',
	
	urlRoot: 'http://localhost:8000/api/contracts',

	saveModel: function() {
		this.save({
			error: this.saveError
		});
	},

	initialize: function() {
		this.on('change', this.saveModel, this);
	},

	saveError: function() {
		throw new Error ('Error saving model!');
	}

})