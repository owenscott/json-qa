var lib = require('./../lib/lib.js');
var fs = require('fs');

module.exports = lib.Backbone.View.extend({

	initialize: function() {
		this.template = fs.readFileSync('./src/templates/meta.html').toString();
		this.template = lib._.template(this.template);
	},

	events: {
		'click #modify': 'modifyStatus'
	},

	render: function() {
		this.$el.html(this.template(this.model.attributes));
	},

	modifyStatus: function() {

		var coder = lib.$('#coderName').val().trim();

		if (!coder) {
			alert('You must put a name in for coder before closing or re-opening')
		}
		else {
			if (this.model.get('status') === 'open') {
				this.model.set('status', 'closed')
				this.model.get('workLog').push({
					event: 'closed',
					coder: coder,
					date: new Date()
				})
			}
			else {
				this.model.set('status', 'open');
				this.model.get('workLog').push({
					event: 'opened',
					coder: coder,
					date: new Date()
				})
			}
			this.render();
			
		}
	}

		

})