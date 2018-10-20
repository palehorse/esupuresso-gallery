(function(factory) {
	if (typeof(require) === 'function') {
		module.exports = factory(jQuery);
	} else {
		factory(jQuery);
	}
})(function($) {
	var _this, _margin, _limit,
		_width, _limit_height,
		_defaults = {},
		obj = (function() {
			var list = [],
				total_width = 0,
				min_height = Number.MAX_SAFE_INTEGER;

			return {
				push: function(item) {
					list.push(item);
					this.findMinHeight();
					this.resize();
				},
				clear: function() {
					list = [];
				},
				findMinHeight: function() {
					for (var i in list) {
						if (list[i].height() < min_height) {
							min_height = list[i].height();
						}
					}
					return min_height;
				},
				checkSize(item) {
					if (list.length >= _limit) {
						return false;
					}
					var itemWidth = item.width(),
						itemHeight = item.height(),
						newTotalWidth = total_width,
						newMinHeight = min_height;

					if (itemHeight < newMinHeight) {
						newMinHeight = itemHeight;
					}

					newTotalWidth = (newTotalWidth + itemWidth) * newMinHeight / min_height;
					if (newMinHeight * (_width - (list.length + 2) * _margin) / total_width >= _limit_height) {
						return true;
					}

					if (list.length == 0) {
						return true;
					}

					return false;
				},
				resize: function() { 
					total_width = 0;
					for (var i in list) {
						var css = {};
						if (min_height != list[i].height()) {
							css.width = list[i].width() * min_height / list[i].height();
							css.height = min_height;
							list[i].css(css);
						}
						total_width += list[i].width();
					}
				},
				putOnTheWall: function() {
					var sum = 0;
					for (var i in list) {
						var css = {};
						css.width = Math.floor(list[i].width() * (_width - (list.length + 1) * _margin) / total_width * 100) / 100;
						css.height = Math.floor(list[i].height() * (_width - (list.length + 1) * _margin) / total_width * 100) / 100;
						css.marginLeft = _margin;
						list[i].css(css);
						sum += css.width;
					}
				},
				getTotalWidth: function() {
					return total_width;
				}
			};
		})();

	function __init() {
		_limit = _defaults.limit;
		_margin = _defaults.margin;
		_width = _this.width();
		_limit_height = 200;
		_this.contents().filter(function() {
			return this.nodeType === 3;
		}).remove();
	}

	$.fn.gallary = function(params) {
		_this = this;
		_defaults = $.extend(_defaults, params); 
		__init();
		_this.find(_defaults.item).each(function() {
			if (obj.checkSize($(this))) {
				obj.push($(this));
			} else {
				obj.putOnTheWall();
				obj.clear();
				obj.push($(this));
			}
		});
		obj.putOnTheWall();
		obj.clear();
		_this.css('visibility', 'visible');
	};
});
