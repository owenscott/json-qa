var lib = require('./../lib/lib.js'),
	Record = require('./../models/record.js'),
	Row = require('./../models/row.js'),
	Data = require('./../models/data.js'),
	RowView = require('./../views/rowView.js'),
	Records = require('./../collections/records.js'),
	DataView = require('./../views/dataView.js'),
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

		this.collection.getFirstPage().done(function() {
			self.setactiveModelIndex(0);
		});

	},

	render: function() {
		var table,
			tableEl;

		//update nav UI and create an empty div for the table view
		this.$el.html(this.template({
			activeModelIndex: this._activeModelIndex + 1,
			totalModels: this.collection.state.totalRecords
		}));


		tableEl = this.$('#table');

		table = new RecordView ({
			model: new RecordModel(this.collection.models[this._activeModelIndex]),
			el: tableEl
		});

	},

	setactiveModelIndex: function(i) {
		try {
			var self = this;
			this.clearErrorScreen();
			if ((!this.collection.models[i] || lib._.isEmpty(this.collection.models[i].attributes)) && i >= 0 && i <= this.collection.state.totalRecords) {
				this.showRecordAsLoading(i);
				this.collection.getPage(i).done(function() {
					self._activeModelIndex = i;
					self.render();
				})
			}
			else if (this.collection.models[i]) {
				this._activeModelIndex = i;
				this.render();
			}
			else {
				alert('Value for record number must be between 1 and ' + this.collection.state.totalRecords);
			}
		}
		catch(e) {
			//should probably switch this to this.collection.state.error and this.collection.state.errorMsg and then add listeners
			this.setErrorScreen('Error loading data for record ' + (i+1));
			throw e;
		}
		
	},

	showRecordAsLoading: function(i) {
		this.$('#table').html('<h3>Loading Record ' + (i+1) + '...</h3>')
	},

	setErrorScreen: function(message) {
		//TODO: some kind of error handling for fetching / displaying records
		this.$el.find('.record-nav').after('<div class="alert alert-danger" role="alert">' + message + '</div>');
	},

	clearErrorScreen: function() {
		this.$el.find('.alert').remove();
	},
	
	onFetchError: function() {
		//TODO: this never gets called anymore after switching to pagination
		throw new Error('Error fetching models');
	},

	navForward: function() {
		this.setactiveModelIndex(this._activeModelIndex + 1);
	},

	navBackward: function() {
		this.setactiveModelIndex(this._activeModelIndex - 1);
	},

	navBeginning: function() {
		this.setactiveModelIndex(0);
	},

	navEnd: function() {
		this.setactiveModelIndex(this.collection.state.totalRecords - 1);
	},

	navGoto: function(e) {

		var value;

		if (e.which === 13) {
			value = lib.$(e.target).val();
			this.setactiveModelIndex(parseInt(value) -1);
		}

	}

});