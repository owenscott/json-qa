//NOTE: because backbone works so much more cleanly with flat JSON objects, this is a flat subset of the model that I actually
//care about, instantiated with a reference to the parent. whenever this child model changes, it updates the parent. 
//the parent itself is what syncs with the server

// Object {match: false, source: 0, value: "Road Construction", cleanValue: "", deleted: false…}
// cleanValue: ""
// deleted: false
// match: false
// source: 0
// sourceValues: Array[2]
// value: "Road Construction"
// __proto__: Object



var lib = require('./../lib/lib.js'),
	Row = require('./../models/row.js'),
	_ = lib._;

var fs = require('fs');

module.exports = lib.Backbone.View.extend({

	model: Row,

	events: {
		// 'click .a' : 'aHandler',
		// 'click .b' : 'bHandler',
		// 'click .a.success' : 'clearValue',
		// 'click .b.success' : 'clearValue',
		// 'dblclick .val' : 'edit',
		// 'blur .edit' : 'stopEditing',
		// 'keypress .edit' : 'blurOnEnter'
	},

	initialize: function() {
		// this.listenTo(this.model, 'change', this.render);
		// this.listenTo(this.model, 'change', this.updateParent);
		this.render();
	},

	render: function () {

		var key = this.model.attributes.key,
			template = _.template( fs.readFileSync('./src/templates/row.html').toString() ),
			rowData;

		//gets the dynamic data from the model itself and the static data from the reference to the parent
		rowData = _.omit( this.model.attributes, 'parent');
		// rowData = _.extend( rowData, {a: this.model.attributes.parent.attributes.a[key]}, {b: this.model.attributes.parent.attributes.b[key]} );

		this.$el.html(template(rowData));

	},

	aHandler: function(event) {
		this.model.set('value',this.model.attributes.parent.attributes.a[this.model.attributes.key]);
	},

	clearValue: function(event) {
		this.model.set('value', '');
	},

	bHandler: function(event) {
		this.model.set('value',this.model.attributes.parent.attributes.b[this.model.attributes.key]);
	},

	updateParent: function() {

		//take the values for the row and apply them back as a patch to the parent object

		var newRowValue = _.omit(this.model.attributes, 'parent', 'key'),
			newMerge = _.clone(this.model.attributes.parent.get('merge')),
			i;

		newMerge[this.model.get('key')] = _.clone(newRowValue);

		//hack (there's some object refernece in the parent child that is causing circular json)
		for (i in newMerge) {
			newMerge[i] = _.omit(newMerge[i], 'parent', 'key');
		}

		this.model.attributes.parent.set('merge', _.clone(newMerge));

	},

	edit: function(e) {
		var el = lib.$(e.target).closest('td');
		el.addClass('edit');
	},

	stopEditing: function(e) {

		var td = lib.$(e.target).closest('td'),
			input,
			newValue;

		//find the actual <input/> element since the event could have been triggered by a click on a different element or propogated
		if (	lib.$(e.target).find('input').length > 0) {
			input = lib.$(e.target).find('input');
		} 
		else if (lib.$(e.target).closest('input').length > 0) {
			input = lib.$(e.target).closest('input');
		}
		else {
			throw new Error ('jquery selectors cannot find input element after blur/enter');
		}

		newValue = input.val().trim();

		//if the new value isn't blank and it's different than the user-selected value then update the cleanValue
		if (newValue && newValue !== this.model.get('value') ) {
			this.model.set('cleanValue', newValue);
		}
		else if (newValue === '') {
			this.model.set('cleanValue', '');
		}

		td.removeClass('edit');

	},

	blurOnEnter: function(e) {
		
		//13 is enter key for keypress event
		if (e.which === 13) {
			this.stopEditing(e);
		}
	
	}

})