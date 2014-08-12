var lib = require('./../lib/lib.js');

var fs = require('fs');

var	conf = JSON.parse(fs.readFileSync('./server/conf.json').toString());

//model assumes the {a:..., b:..., merge:..., arrays:...} structure used by the json-merge module

module.exports = lib.Backbone.Model.extend({

	idAttribute: '_id',
	
	urlRoot: 'http://' + conf.clientUrl + ':' + conf.port + '/api/contracts',

	saveModel: function() {

		//TODO: remove this. total monkey patch to make up for accidental appending of self as child of 'data' somewhere
		this.set('data', lib._.omit(this.get('data'),'parent'));

		this.save({
			error: this.saveError
		});
	},

	initialize: function() {
		this.on('childUpdate', function() {
			this.saveModel();
		})

		console.log(this.urlRoot);
	},

	saveError: function() {
		throw new Error ('Error saving model!');
	}

})