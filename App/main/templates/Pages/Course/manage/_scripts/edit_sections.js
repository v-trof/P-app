$(document).ready(function() {
	var section_selector = '.course-part'
		heading_selector = 'h3'
		item_selector = '.m--card';
		unordered_heading = 'Неопубликованные'

	var send_changes = function() {
		//parse
		var sections = {
			published: {},
			unpublished: []
		}

		$('.tests-materials').children(section_selector).each(function() {
			var name = $(this).find(heading_selector).text();
			if(name == unordered_heading) {
				//exit early
				return;
			}

			sections.published[name] = [];

			$(this).find(item_selector).each(function(index, el) {
				var href= $(this).attr('href');
				var id = href.split("=")[href.split("=").length-1];
				var type = href.split("/")[1];

				sections.published[name].push({
					type: type,
					id: id
				});
			});
		})
		section_editor.$unordered.find(item_selector).each(function(index, el) {
				var href= $(this).attr('href');
				var id = href.split("=")[href.split("=").length-1];
				var type = href.split("/")[1];

				sections.unpublished.push({
					type: type,
					id: id
				});
			});
		//ajax
		$.ajax({
			type:"POST",
			url:"/func/edit_sections/",
			data: {
				'sections': JSON.stringify(sections),
				'csrfmiddlewaretoken': '{{ csrf_token }}',
				'course_id': "{{course.id}}"
			},
			success: function() {
				notification.show('success', 'Секции курса изменены');
				popup.hide();
			}
		});
	}
	
	section_editor.init({
		$parent: $('.tests-materials'),
		$section_template: $('<section class="course-part"><h3>Новая секция</h3></section>'),
		section_selector: section_selector,
		heading_selector: heading_selector,
		item_selector: item_selector,
		replace: true,
		no_publish: true,
		unordered_heading: unordered_heading,
		_save_callback: send_changes
	});

	$(".tests-materials").children(section_selector).each(function(index, el) {
		accordion.add($(this), heading_selector);	
	});
});
