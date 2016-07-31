var indicator = (function() {

	var template = '{% include "Elements/Modules/indicator/exports.html" %}'

	var icons = {
		add: '{% include "Elements/Icons/add.svg" %}',
		down: '{% include "Elements/Icons/angle_down.svg" %}'
	}

	var build = function(icon) {
		var $new_indicator = $(template);

		$new_indicator.find('button').html(icons[icon]);

		$new_indicator.addClass('--' + icon);
		return $new_indicator;
	};

	var add = function($parent, icon, group) {

		if($parent.children('.indicator.g' + group).length > 0) {
			return;
		}

		var $new_indicator = build(icon);
		$new_indicator.addClass('g' + group)
		$parent.append($new_indicator);
		$new_indicator.hide();
	}

	var hide = function(group) {
		if(typeof group === "undefined") {
			$('.indicator').hide();
		} else {
			$('.indicator.g' + group).hide();
		}	
	}

	var show = function(group) {
		if(typeof group === "undefined") {
			$('.indicator').show();
		} else {
			$('.indicator.g' + group).show();
		}	

		$('.pull_put_ui .indicator').hide();
	}


	var exports = {
		add: add,
		hide: hide,
		show: show
	}

	return exports;
})();
