var tooltip = (function() {
	$tooltip = $('<div id="tooltip" class="--hidden"><div class="__content"></div></div>');
	function directions(element) {
		//disabling jQuery
		element = $(element)[0]

		element_rect = element.getBoundingClientRect();
		tooltip_rect = $tooltip[0].getBoundingClientRect();

		exports = {
			top: {
				top: element_rect.top - tooltip_rect.height + 'px',
				left: element_rect.left + 'px',
				class: '--top'
			},
			top_centered: {
				top: element_rect.top - tooltip_rect.height + 'px',
				left: element_rect.left - 
					(tooltip_rect.width/2 - element_rect.width/2) + 'px',
				class: '--top'
			},
			right: {
				height: element_rect.height + 'px',
				top: element_rect.top + 'px',
				left: element_rect.left + element_rect.width + 'px',
				class: '--right'
			},
			left: {
				height: element_rect + 'px',
				top: element_rect.top + 'px',
				left: element_rect.left - tooltip_rect.width + 'px',
				class: '--left'
			},
			bottom: {
				top: element_rect.top + element_rect.height + 'px',
				left: element_rect.left + 'px',
				class: '--bottom'
			},
			bottom_centered: {
				top: element_rect.top + element_rect.height + 'px',
				left: element_rect.left - 
					(tooltip_rect.width/2 - element_rect.width/2) + 'px',
				class: '--bottom'
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
	function prevent_edge_breaking() {
		tooltip_rect = $tooltip[0].getBoundingClientRect();

		if( $tooltip.css('left')[0]=='-'){
			$tooltip.css('left', '0');
		}
		if( $tooltip.css('top')[0]=='-'){
			$tooltip.css('top', '0');
		}
		
		if(tooltip_rect.top + tooltip_rect.height > $(window).height()) {
			$tooltip.css({
				'bottom': 0,
				'top': 'auto',
			});
		}

		if(tooltip_rect.left + tooltip_rect.width > $(window).width()) {
			$tooltip.css({
				'right': 0,
				'left': 'auto',
			});
		}
	}
	exports = {
		$: $tooltip,
		show: function(element, content, direction) {
			var position;

			$tooltip.find('.__content').html(content);
			if(direction) {
				position = directions(element)[direction];
			} else {
				position = directions(element).auto;
			}

			$tooltip.css(position);
			$tooltip.addClass(position.class)
			prevent_edge_breaking();

			$tooltip.removeClass('--hidden');
		},
		hide: function() {
			$tooltip.addClass('--hidden');
			$tooltip.removeAttr('style');
		}
	}
	return exports;
})();

$(document).ready(function() {
	$('body').append(tooltip.$);
	$('body').on({
		focus: function() {
			tooltip.show(this,  $(this).attr('tip'));
		},
		mouseenter: function() {
			tooltip.show(this,  $(this).attr('tip'));
		},
		mouseleave: function() {
			tooltip.hide();
		},
		blur: function() {
			tooltip.hide();
		}
	}, '[tip]');
	$(document).scroll(function(event) {
		tooltip.hide();
	});
});