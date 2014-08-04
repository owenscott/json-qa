var lib = require('./../lib/lib.js'),
	ArrayModel = require('./../models/array.js');

var fs = require('fs');

module.exports = lib.Backbone.View.extend({

	initialize: function() {
		this.template = lib._.template(fs.readFileSync('./src/templates/array.html').toString());
		this.render();
	},

	events: {
		'click .original-values button': 'originalClickHandler',
		'click .final-values button': 'finalClickHandler'
	},

	render: function() {

		var matchedValues,
			unmatchedValues = [];

		matchedValues = lib._.sortBy(this.model.get('merge'), function(m) {return m.value});

		this.model.get('originals').forEach(function(arr) {
			unmatchedValues.push(lib._.filter(arr, function(a) {
				return !lib._.contains(lib._.pluck(matchedValues, 'value'), a);
			}).sort())
		});

		this.$el.html(this.template({
			matchs: matchedValues,
			nonMatchs: unmatchedValues
		}));
	
	},

	model: ArrayModel,

	originalClickHandler: function(e) {
		
		var i = lib.$(e.currentTarget).parent('.original-values').data('arrayref'),
			value = e.currentTarget.innerHTML,
			originalValues,
			source,
			merge,
			match;

		originalValues = lib._.clone(this.model.get('originals'));
		merge = lib._.clone(this.model.get('merge'));

		this.model.set('originals', lib._.clone(originalValues));

		match = false;

		lib._.without(lib._.range(originalValues.length), i).forEach (function(orig) {
			if (originalValues[orig].indexOf(value) > -1) {
				match = true;
				source = 'MATCH' 
			}
			
		});

		if (source !== 'MATCH') {
			source = i;
		}

		merge.push({
			cleanValue: '',
			deleted: false,
			match: match,
			source: source,
			value: value
		});

		this.model.set('merge', lib._.clone(merge));
		this.model.set('originals', lib._.clone(originalValues));

		this.render();
		
	},

	finalClickHandler: function(e) {

		var value = e.currentTarget.innerHTML.trim(),
			originalValues,
			merge,
			source;

		source = lib._.find(this.model.get('merge'), function (m) {
			return m.value.trim() === value.trim()
		}).source;
		merge = lib._.chain(this.model.get('merge')).clone().reject(function(m) {return m.value.trim() === value.trim()}).value();

		// originalValues = this.model.get('originals');

		// if (source === 'MATCH') {
		// 	originalValues.forEach(function(a) {
		// 		a.push(value);
		// 		a = _.uniq(a);
		// 	})
		// }
		// else {
		// 	originalValues[source].push(value);
		// }

		this.model.set('merge', lib._.clone(merge));
		// this.model.set('originals', lib._.clone(originalValues));

		this.render();


	}

})