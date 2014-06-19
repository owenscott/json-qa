var lib = require('./../lib/lib.js'),
	Record = require('./../models/record.js'),
	Row = require('./../models/row.js'),
	RowView = require('./../views/rowView.js')

module.exports = lib.Backbone.View.extend({
	
	initialize: function() {
		this.render();
	},

	render: function() {

		var record = this.model,
			self = this;


		//append all of the rows
		lib._.each(this.model.attributes.merge, function(obj, key) {

			var row,
				rowEl,
				rowView;

			row = new Row ( lib._.extend( obj, {
				parent: record,
				key: key
			}));

			rowEl = lib.$('<tr></tr>').appendTo(self.el);

			//only for the sideffects
			rowView = new RowView({
				model:row,
				el: rowEl
			})
				
		})

	}

});