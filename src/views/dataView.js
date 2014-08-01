var lib = require('./../lib/lib.js'),
	Record = require('./../models/record.js'),
	Row = require('./../models/row.js'),
	RowView = require('./../views/rowView.js');

var	fs = require('fs');

module.exports = lib.Backbone.View.extend({
	
	initialize: function() {
		this.template = lib._.template(fs.readFileSync('./src/templates/table.html').toString());
		this.render();
	},

	render: function() {

		var record = this.model,
			self = this,
			omits = ['hash', 'CODER_ID','ID','coder','TENDER_NOTICE_ID'],
			idField = 'coder';

		var numberOfColumns = this.model.attributes.keyValuePairs.originals.length,
			columnIds = lib._.map(this.model.attributes.keyValuePairs.originals, function(o) {return o[idField] || ''})

		this.$el.html(this.template({
			numberOfColumns: numberOfColumns,
			columnIds: columnIds
		}));

		//iterate through all of the keys
		lib._.each(this.model.attributes.keyValuePairs.merge, function(obj, key) {
			
			if (!lib._.contains(omits, key)) {
	
				var rowData = {},
					sourceValues = [],
					row,
					rowEl,
					rowView;

				sourceValues = lib._.chain(self.model.attributes.keyValuePairs.originals).map(function(obj) { return lib._.clone(obj[key]) || ''}).value();
	
				//sanity check - should never throw
				if (sourceValues.length !== numberOfColumns) {
					throw 'Custom Error: Not as many sourveValues as columns';
				}

				rowData = lib._.chain(obj).clone().extend({sourceValues:sourceValues}).value();
	
				row = new Row ( lib._.extend( rowData, {
					parent: record,
					key: key
				}));
	
				rowEl = lib.$('<tr></tr>').appendTo(self.$('#table-body'));
	
				//only for the sideffects
				rowView = new RowView({
					model:row,
					el: rowEl
				})}

		})
	}

});




