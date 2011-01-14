/**
 * Class for managing the svg elements
 * @namespace
 */
vonline.Canvas = function() {
	var that = this;
	this.container = $('#canvas');
	this.paper = Raphael('canvas', this.container.width(), this.container.height());
	this.objects = [];
	this.selection = new vonline.Selection(this);
	this.initRectangleSelection();
	
	function onResize() {
		var sidebarwidth = $('#sidebar').width(),
			documentwidth = $(window).width();
		that.container.css({width: (documentwidth-sidebarwidth)+'px', marginLeft: sidebarwidth+'px'});
		that.paper.setSize(that.container.width(), that.container.height());
	}
	$(window).bind('resize', onResize);
}

/**
 * loads a document from its json representation
 * @param {array} json array containing the components
 * @exmaple
 * vonline.document.canvas.load([{type:'rectangle', id:1, scaleX:1, scaleY:1, x: 100, y:50}]);
 */
vonline.Canvas.prototype.load = function(json) {
	for (var i = 0, count = json.length; i < count; i++) {
		switch (json[i].type) {
			case 'rectangle':
				var obj = new vonline.Rectangle(json[i]);
				this.add(obj);
			break;
		}
	}
}

/**
 * @param {vonline.Base} obj
 */
vonline.Canvas.prototype.add = function(obj) {
	obj.setCanvas(this);
	this.objects.push(obj);
}

vonline.Canvas.prototype.getPaper = function() {
	return this.paper;
}

vonline.Canvas.prototype.exportJSON = function() {
	var json = [];
	for (var i = 0, count = this.objects.length; i < count; i++) {
		json.push(this.objects[i].toJSON());
	}
	return json;
}

vonline.Canvas.prototype.initRectangleSelection = function() {
	var that = this;
	this.container.mousedown(function(event) {
		var x = event.offsetX,
			y = event.offsetY,
			rect = that.paper.rect(x, y).attr({stroke: 'blue', fill: 'rgba(0,100,255,.5)'});
		
		var moveEvent = function(event) {
			//console.log(event.offsetX, event.offsetY);
			var width = (event.offsetX - x),
				height = (event.offsetY - y);
			if (width < 0) {
				rect.attr('width', -width);
				rect.attr('x', event.offsetX);
			}
			else {
				rect.attr('width', width);
				rect.attr('x', x);
			}
			if (height < 0) {
				rect.attr('height', -height);
				rect.attr('y', event.offsetY);
			}
			else {
				rect.attr('height', height);
				rect.attr('y', y);
			}
		}
		that.container.mousemove(moveEvent);
		
		that.container.one('mouseup', function() {
			that.container.unbind('mousemove', moveEvent);
			that.selection.clear();
			var bbox = rect.getBBox();
			rect.remove();
			for (var i = 0, count = that.objects.length; i < count; i++) {
				if (that.objects[i].fitsIn(bbox)) {
					that.selection.add(that.objects[i]);
				}
			}
		})
	});
}