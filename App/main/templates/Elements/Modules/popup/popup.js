var popup = (function() {
	$popup = $('{% include "Elements/Modules/popup/exports.html" %}')
	exports = {
		$: $popup,
		show: function(content, callback, css) {
			console.log($popup)
			$popup.find(".__content").html(content);
			$popup.removeClass('--hidden');
			
			$popup.find(".--select").each(function(index, el) {
				// console.log(this);
				add_menu_caller(this);
			});
			$popup.find("input").first().focus();

			if(css){
				$popup.find('__modal').css(css);
			}

			if(callback){
				callback();
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