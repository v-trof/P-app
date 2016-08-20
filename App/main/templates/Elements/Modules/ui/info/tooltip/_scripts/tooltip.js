var tooltip = (function() {
	$tooltip = $('<div id="tooltip" class="m--hidden"><div class="__content"></div></div>');
	function directions(element) {
		//disabling jQuery
		element = $(element)[0]

		element_rect = element.getBoundingClientRect();
		tooltip_rect = $tooltip[0].getBoundingClientRect();

		exports = {
			top: {
				top: element_rect.top - tooltip_rect.height + 'px',
				left: element_rect.left + 'px',
				class: 'm--top'
			},
			top_centered: {
				top: element_rect.top - tooltip_rect.height + 'px',
				left: element_rect.left - 
					(tooltip_rect.width/2 - element_rect.width/2) + 'px',
				class: 'm--top'
			},
			top_right: {
				top: element_rect.top - tooltip_rect.height + 'px',
				left: element_rect.left + element_rect.width - 
					tooltip_rect.width*2 + 'px',
				class: 'm--top'
			},
			right: {
				height: element_rect.height + 'px',
				top: element_rect.top + 'px',
				left: element_rect.left + element_rect.width + 'px',
				class: 'm--right'
			},
			left: {
				height: element_rect + 'px',
				top: element_rect.top + 'px',
				left: element_rect.left - tooltip_rect.width + 'px',
				class: 'm--left'
			},
			bottom: {
				top: element_rect.top + element_rect.height + 'px',
				left: element_rect.left + 'px',
				class: 'm--bottom'
			},
			bottom_centered: {
				top: element_rect.top + element_rect.height + 'px',
				left: element_rect.left - 
					(tooltip_rect.width/2 - element_rect.width/2) + 'px',
				class: 'm--bottom'
			}
		}

		var height_delta = Math.abs(tooltip_rect.height - element_rect.height)

		if(tooltip_rect.width > element_rect.width) {
			exports.auto = exports.top_centered;
		} else if (height_delta < 16) {
			exports.auto = exports.right;
		} else {
			exports.auto = exports.top;
		}

		return exports;
	}
	function prevent_edge_breaking(element, position) {
		var re_position = false;

		var tooltip_rect = $tooltip[0].getBoundingClientRect();

		if($tooltip.css('left')[0]=='-') {
			if(position.class == 'm--left') {
				re_position = directions(element).top_right;
			} else {
				$tooltip.css('left', 0);
			}
		}

		if( $tooltip.css('top')[0]=='-') {
			if(position.class == 'm--top') {
				re_position = directions(element).bottom;
			} else {
				$tooltip.css('top', 0);
			}
		}
		
		if(tooltip_rect.top + tooltip_rect.height > $(window).height()) {
			if(position.class == 'm--bottom') {
				re_position = directions(element).top;
			} else {
				$tooltip.css({
					'bottom': 0,
					'top': 'auto',
				});
			}
		}

		if(tooltip_rect.left + tooltip_rect.width > $(window).width()) {
			if(position.class == 'm--right') {
				re_position = directions(element).top_right;
			} else {
				$tooltip.css({
					'right': 0,
					'left': 'auto',
				});
			}
		}

		if(re_position) {
			$tooltip.css(re_position);
			
			reset_class();

			$tooltip.addClass(re_position.class);
		}
	}

	function reset_class() {
		$tooltip.removeClass("m--left");
		$tooltip.removeClass("m--right");
		$tooltip.removeClass("m--top");
		$tooltip.removeClass("m--bottom");
	}

	exports = {
		$: $tooltip,
		input_made: false,
		show: function(element, content, direction) {
			var position;

			$tooltip.find('.__content').html(content);
			if(direction) {
				position = directions(element)[direction];
			} else {
				position = directions(element).auto;
			}

			$tooltip.css(position);
			
			reset_class();

			$tooltip.addClass(position.class);

			prevent_edge_breaking(element, position);

			$tooltip.removeClass('m--hidden');
		},
		hide: function() {
			// console.log('hidden');
			$tooltip.addClass('m--hidden');
			$tooltip.removeAttr('style');
			$('header').click();
		}
	}
	return exports;
})();

$(document).ready(function() {
	$('body').append(tooltip.$);
	$('body').on({
		focus: function() {
			// console.log(this.tagName);
			if(! (this.tagName === 'BUTTON' 
				|| this.tagName === 'A'
				|| this.tagName === 'DIV')) {
				tooltip.input_made = true;
			}
			tooltip.show(this,  $(this).attr('tip'));
		},
		mouseenter: function() {
			if( ! tooltip.input_made) {
				// console.log('shown');
				tooltip.show(this,  $(this).attr('tip'));
			}
		},
		mouseleave: function() {
			if( ! tooltip.input_made) {
				tooltip.hide();
			}
		},
		blur: function() {		
			tooltip.input_made = false;
			tooltip.hide();	
		}
	}, '[tip]');
	$(document).scroll(function(event) {
		tooltip.hide();
	});
});
