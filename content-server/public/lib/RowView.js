var RowView = Backbone.View.extend({
	
	/////////////////////////////////////////////////////////////////
	// Must be implemented by child
	/////////////////////////////////////////////////////////////////
	open: function () {},
	markup: {},
	/////////////////////////////////////////////////////////////////


	events: {
		'click.row' : 'open',
		'mouseenter.row' : 'mouseenter',
		'mouseleave.row' : 'mouseleave'
	},

	initialize: function(options) {
		_.bindAll(this);
		this.model = options.model;
		this.containerEl = "table.ui-table tbody";
		this.el = null;
		
		// Add child's events
		if (this.events)
			this.events = _.defaults(this.events, RowView.prototype.events);

		$(this.ready);
	},

	ready: function () {
	},

	mouseenter: function () {
		$(this.el).addClass("hovered");
	},
	mouseleave: function () {
		$(this.el).removeClass("hovered");
	},

	render: function () {
		// Redraw all elements
		var newElem = $(this.generateHTML()).appendTo(this.containerEl);
		this.el = newElem;
		this.delegateEvents();
	},

	prepend: function () {
		var newElem = $(this.generateHTML()).prependTo(this.containerEl);
		this.el = newElem;
		this.delegateEvents();
	},

	// Return the HTML especially for this row
	generateHTML: function () {
		var template = this.markup.row;

		// Adapt attributes to work:
		var map = this.model.attributes;
		map = this.transform(map);

		var html = $.stubble(template,map);
		return html;
	},

	//  Adapt data-- by default, formats dates (can be overridden)
	transform: function (map) {
		map.dateSent = moment(map.dateSent).from(moment());
		map.dateModified = moment(map.dateModified).from(moment());
		map.dateCreated = moment(map.dateCreated).from(moment());
		return map;
	},


	destroy: function (e) {
		// Id must be specified in order for backbone to talk to the server
		this.model.id = this.model.attributes.id;

		// Remove from server
		this.model.destroy();

		// Remove from DOM
		this.remove();
	}
})

var Row = Backbone.Model.extend({
	initialize: function(attrs) {
		// Cast fields that must be integers
		attrs.id = +attrs.id;
		this.id = attrs.id;

		this.body = attrs;
		this.attributes = attrs;
	},
	defaults: {
	},
	rules: {
}
})