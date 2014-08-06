var lib = require('./../lib/lib.js'),
	Record = require('./../models/record.js'),
	RecordView = require('./../views/recordView.js');

var PageableCollection = require('backbone.paginator');

module.exports = PageableCollection.extend({
	
	model: Record,

	initialize: function() {
		this.url = 'http://0.0.0.0:8000/api/contracts';
	},

	state: {
		firstPage: 0,
		pageSize: 1 //see TODO below
	},

	parseRecords: function(response, options) {
		
		//TODO: this will break immediately if page size is every > 1
		var tempModels = lib._.clone(this.models) || [];
		tempModels[this.state.currentPage] = response.items[0];
		return tempModels;
	},

	parseState: function (resp, queryParams, state, options) {
    return {totalRecords: resp.total_count};
  }

})
