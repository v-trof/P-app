var context_menu = (function() {
	var $menu = $("<div id='context_menu' class='m--hidden m--hiding'></div>");
	var is_shown = false;

	var build = function(options, el, chosen) {
		$menu.html("");
		$menu.attr("style", "");
		if(el) {
			$menu.append("<div class='__option default' value='" + chosen.value + "'>" + chosen.text + "</div>")

			options.forEach(function(option) {
				$menu.append("<div class='__option' value='" + option.value + "'>" + option.text + "</div>");
			});

			
		} else {
			options.forEach(function(option) {
				$menu.append("<div class='__option' onclick='" + option.func + "()'>" + option.text + "</div>");
			});
		}
		context_menu.bind_selects(el);
	}

	function reposition(el) {
		c_rect = el.getBoundingClientRect();
		$menu.removeAttr('style');

		$menu.css({
			"top": c_rect.top + "px",
			"left": c_rect.left + "px",
			"width": c_rect.width + "px",
		});

		menu_rect = $menu[0].getBoundingClientRect();


		if(menu_rect.top + menu_rect.height > $(window).height()) {
			$menu.css({
				"bottom": 0,
				"top": "auto",
			})
		}

		if(menu_rect.left + menu_rect.width > $(window).width()) {
			$menu.css({
				"right": 0,
				"left": "auto",
			})
		}
	}

	exports = {
		$: $menu,
		reposition: reposition,
		bind_selects: function(el) {
			$menu.find(".__option").click(function(event) {
				context_menu.hide();
				$(el).find('input').val($(this).attr('value')).change();
				$(el).children('.__display').text($(this).text());
				($(el).find('input').val(), $(el).find('input'));
			});
		},
		show: function(options, el, chosen, sectioned) {
			$("body").append($menu);
			if(is_shown) {
				context_menu.hide();
			}

			if(sectioned) {
				context_menu.build_section_select(options, el, chosen);
			} else {
				build(options, el, chosen);
			}

			reposition(el);

			$menu.removeClass('m--hidden')
			$menu.removeClass('m--hiding')
		},

		hide: function() {
			$menu.addClass('m--hiding')
			setTimeout(function() {
				$menu.addClass('m--hidden')
				$menu.removeAttr('style')
			}, 150);
		}
	}
	return exports;
})();

$(document).scroll(function(event) {
	context_menu.hide();
});
