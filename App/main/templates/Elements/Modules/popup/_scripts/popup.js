var popup = (function() {
	$popup = $('{% include "Elements/Modules/popup/exports.html" %}')
	exports = {
		$: $popup,
		show: function(content, _callback, css) {
			$popup.find(".__content").html(content);
			$popup.removeClass('--hidden');
			
			$popup.find(".--select").each(function(index, el) {
				add_menu_caller(this);
			});

			$popup.find(".--sectioned").each(function(index, el) {
				add_menu_caller_sectioned(this);
			});
			$popup.find("input").first().focus();

			if(css) {
				$popup.find('__modal').css(css);
			}

			if(_callback) {
				_callback();
			}
		},
		hide: function() {
			$popup.addClass('--hidden');
			$popup.find('__modal').removeAttr('style');

			if(typeof tooltip !== 'undefined') {
				tooltip.hide()
			}
			if(typeof context_menu !== 'undefined') {
				context_menu.hide()
			}
		}
	}
	return exports;
})();

$(document).ready(function() {
	$('body').append(popup.$)
	popup.$.find('.__close').click(function(e) {
		popup.hide();
	});
});
