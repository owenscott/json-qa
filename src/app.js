var Records = require('./collections/records.js'),
	RecordView = require('./views/recordView.js'),
	AppView = require('./views/appView.js'),
	$ = require('jquery'),
	appView;


$(document).ready(function() {

	var appView = new AppView({
		el:'#app',
		collection: new Records()
	})
// $('body').append('foo');

})




