/**
 * @param {vonline.Sidebar} sidebar
 * @param {vonline.Category array} visible
 * @param {vonline.Category array} notvisible
 */
vonline.CategoryEditView = function(sidebar, visible, notvisible) {
	this.sidebar = sidebar;
	this.visible = visible;
	this.notvisible = notvisible;
}

vonline.CategoryEditView.prototype.open = function() {
	var that = this;
	this.container = this.sidebar.setExtraView(true);
	
	var add = function(category) {
		that.notvisible = $.without(that.notvisible, category);
		that.visible.push(category);
		category.getHTML().detach();
		that.sidebar.addCategory(category);
		category.setMode('remove', function() {
			remove(category);
		});
	},
	remove = function(category) {
		that.visible = $.without(that.visible, category);
		that.notvisible.push(category);
		category.getHTML().detach();
		category.close();
		that.container.append(category.getHTML());
		category.setMode('add', function() {
			add(category);
		});
	};
	
	$.each(this.notvisible, function(i, category) {
		that.container.append(category.getHTML());
		category.close();
		category.setMode('add', function() {
			add(category);
		});
	});
	$.each(this.visible, function(i, category) {
		category.setMode('remove', function() {
			remove(category);
		});
	});
}

vonline.CategoryEditView.prototype.close = function() {
	this.sidebar.setExtraView(false);
	this.container = null;
	$.each(this.visible, function(i, category) {
		category.setMode(false);
	});
	// TODO: save the visible categories
}

vonline.CategoryEditView.prototype.toggle = function() {
	if (this.container) {
		this.close();
	}
	else {
		this.open();
	}
	$(window).trigger('resize');
}

/**
 * returns an array of visible categories
 */
vonline.CategoryEditView.prototype.getCategories = function() {
	var categories = [];
	$.each(this.visible, function(i, category) {
		categories.push(category.id);
	});
	return categories;
}