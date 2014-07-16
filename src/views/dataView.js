			initialize: function() {
		this.template = fs.readFileSync('./src/templates/table.html').toString();
		console.log(this.model);
		this.render();
	},

	render: function() {

		var record = this.model,
			self = this;

		this.$el.html(this.template);
		
		//append all of the rows
		lib._.each(this.model.attributes.merge, function(obj, key) {

			var row,
				rowEl,
				rowView;

			row = new Row ( lib._.extend( obj, {
				parent: record,
				key: key
			}));

			rowEl = lib.$('<tr></tr>').appendTo(self.$('#table-body'));

			//only for the sideffects
			rowView = new RowView({
				model:row,
				el: rowEl
			})
				
		})

	}



		
			model: new DataModel(childModelData),

		childModelData = lib._.extend(this.collection.models[this._activeModelIndex].get('data'), {parent: this.collection.models[this._activeModelIndex]});
