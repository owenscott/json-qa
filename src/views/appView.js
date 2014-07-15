var lib = require('./../lib/lib.js'),
	Record = require('./../models/record.js'),
	Row = require('./../models/row.js'),
	RowView = require('./../views/rowView.js'),
	Records = require('./../collections/records.js'),
	RecordView = require('./../views/recordView.js');

var	fs = require('fs');

module.exports = lib.Backbone.View.extend({

	collection: Records,

	events: {
		'click #nav-forward': 'navForward',
		'click #nav-backward': 'navBackward',
		'click #nav-beginning': 'navBeginning',
		'click #nav-end': 'navEnd',
		'keypress #nav-goto': 'navGoto'
	},
	
	initialize: function() {
		
		var self = this;

		this.template = lib._.template(fs.readFileSync('./src/templates/app.html').toString());
		

		// this.collection.fetch({

		// 	//had to inline success function in order to bind 'this' properly
		// 	success: function(collection) {

		// 		//by default render the first model in the collection
		// 		self.setActiveModel(0);

		// 	},

		// 	error: this.onFetchError
		
		// });

		this.collection.getFirstPage().done(function() {
			self.setActiveModel(0);
		});

	},

	render: function() {

		this.$el.html(this.template({
			activeModel: this._activeModel + 1,
			totalModels: this.collection.state.totalRecords
		}));

		var table,
			tableEl;

		tableEl = this.$('#table');

		table = new RecordView ({
			model: this.collection.models[this._activeModel],
			el: tableEl
		});
	},

	setActiveModel: function(i) {

		var self = this;

		if ((!this.collection.models[i] || lib._.isEmpty(this.collection.models[i].attributes)) && i >= 0 && i <= this.collection.state.totalRecords) {
			this.showRecordAsLoading(i);
			this.collection.getPage(i).done(function() {
				self._activeModel = i;
				self.render();
			})
		}
		else if (this.collection.models[i]) {
			this._activeModel = i;
			this.render();
		}
		else {
			alert('Value for record number must be between 1 and ' + this.collection.state.totalRecords);
		}

	},

	showRecordAsLoading: function(i) {
		
		this.$('#table').html('<h3>Loading Record ' + (i+1) + '...</h3>')
	},

	setErrorScreen: function() {

	},
		
	
	onFetchError: function() {
		throw new Error('Error fetching models');
	},

	navForward: function() {
		this.setActiveModel(this._activeModel + 1);
	},

	navBackward: function() {
		this.setActiveModel(this._activeModel - 1);
	},

	navBeginning: function() {
		this.setActiveModel(0);
	},

	navEnd: function() {
		this.setActiveModel(this.collection.state.totalRecords - 1);
	},

	navGoto: function(e) {

		var value;

		if (e.which === 13) {
			value = lib.$(e.target).val();
			this.setActiveModel(parseInt(value) -1);
		}

	}

});