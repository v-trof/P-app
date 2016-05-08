var notification = (function() {
	var template = {
		notification : '<div class="notification --hidden"><div class="__icon"></div><div class="__text"></div></div>',
		icon : {
			error: '{% include "Elements/Icons/cancel.svg" %}',
			warning: '{% include "Elements/Icons/warning.svg" %}',
			success: '{% include "Elements/Icons/done.svg" %}',
			info: '{% include "Elements/Icons/info.svg" %}'
		}
	}
	function build (type, content) {
		var $new_notification = $(template.notification);
		$new_notification.addClass('--'+type);
		
		$new_notification.find('.__icon').html(template.icon[type]);
		$new_notification.find('.__text').html(content);
		
		return $new_notification;
	}

	function reposition () {
		$('.notification').each(function(index, el) {
			$(this).css('transform', 'translateY(' + index*3.5 + 'rem)');
		});
	}

	var exports = {
		show: function(type, content) {
			var $new_notification = build(type, content);
			$('body').append($new_notification);
			setTimeout(function() {
				$new_notification.removeClass('--hidden');
			}, 10)

			$new_notification.click(function() {
				notification.hide($new_notification);
			});
			
			reposition();
			
			setTimeout(function() {
				notification.hide($new_notification);
			}, 10000)
		},

		hide: function($notification) {
			console.log($notification);
			$notification.addClass('--hidden');
			setTimeout(function() {
				$notification.remove();
				reposition();	
			}, 150)	
		}
	}
	return exports;
})();