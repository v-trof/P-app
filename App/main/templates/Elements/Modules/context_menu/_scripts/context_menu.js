var context_menu = (function() {
	var $menu = $("<div id='context_menu' class='--hidden --hiding'></div>")
	var is_shown = false

	var build = function(options, el, chosen) {
		$menu.html("");
		$menu.attr("style", "");
		if(el) {
			$menu.append("<div class='__option default' value='" + chosen.value + "'>" + chosen.text + "</div>")

			options.forEach(function(option) {
				$menu.append("<div class='__option' value='" + option.value + "'>" + option.text + "</div>");
			});

			$menu.children(".__option").click(function(event) {
				context_menu.hide();
				$(el).children('input').val($(this).attr('value'));
				$(el).children('.__display').text($(this).text());
			});
		} else {
			options.forEach(function(option) {
				$menu.append("<div class='__option' onclick='" + option.func + "()'>" + option.text + "</div>");
			});
		}
	}
	exports = {
		show: function(options, el, chosen) {
			$("body").append($menu);
			if(is_shown) {
				context_menu.hide();
			}

			c_rect = el.getBoundingClientRect();

			build(options, el, chosen);

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

			$menu.removeClass('--hidden')
			$menu.removeClass('--hiding')
		},

		hide: function() {
			$menu.addClass('--hiding')
			setTimeout(function() {
				$menu.addClass('--hidden')
				$menu.removeAttr('style')
			}, 150);
		}
	}
	return exports;
})();

$(document).scroll(function(event) {
	context_menu.hide();
});