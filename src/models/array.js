var lib = require('./../lib/lib.js');

module.exports = lib.Backbone.Model.extend({
	defaults: {
		originals: [],
		merge: []
	}
});