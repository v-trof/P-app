$(document).ready(function() {
	var section_selector = '.course-part'
		heading_selector = 'h3'
		item_selector = '.--card';
		unordered_heading = 'Неопубликованные'
	var send_changes = function() {
		//parse
		//ajax
	}
	
	section_editor.init({
		$parent: $('.tests-materials'),
		$section_template: $('<section class="course-part"><h3>Новая секция</h3></section>'),
		section_selector: section_selector,
		heading_selector: heading_selector,
		item_selector: item_selector,
		replace: true,
		unordered_finder: function() {
			$('.tests-materials').find(section_selector).each(function(index, el) {
				if($(this).find(heading_selector).text() === unordered_heading) {
					return $(this);
				}
			});
		},
		unordered_heading: unordered_heading,
		_save_callback: send_changes,
		pull: {
			actions: []
		}
	})
});
