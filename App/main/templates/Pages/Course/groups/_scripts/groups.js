var renames = {};

$(document).ready(function() {
sort_by_text($(".students"), "h3");

var section_selector = '.group'
	heading_selector = 'h3'
	item_selector = '.--card';
	unordered_heading = 'Нераспределенные'

$(".students").children(section_selector).each(function(index, el) {
	accordion.add($(this), heading_selector);	
});

var send_changes = function() {
	//back stuff
	var groups={};
	
	var popup_invite = $(invite_students_text)
	$(popup_invite[2]).find("option").remove();
	$(".group").each(function(index, el) {
		group=$(this).children('h3').html();
		
		$(popup_invite[2]).append('<option value="' + group + '">'
			+ group + '</option>');

		groups[group]=[];
		
		$(this).find('.__name').each(function() {
			groups[group].push($(this).html());
		});
	});

	invite_students_text = popup_invite;
	$.ajax({
		type:"POST",
		url:"/func/edit_groups/",
		data: {
		   'groups_data': JSON.stringify(groups),
		   'csrfmiddlewaretoken': '{{ csrf_token }}',
			'course_id': "{{course.id}}",
		   'renames':JSON.stringify(renames)
		  },
		success: function() {
		  notification.show('success', 'Группы изменены' );
		  $('#groups_content').load('../groups_content/');
		}
	});
}

{% if course_data.user_status == "administrator" %}
section_editor.init({
	$parent: $('.students'),
	$section_template: $('<section class="group"><h3>Новая группа</h3></section>'),
	section_selector: section_selector,
	heading_selector: heading_selector,
	item_selector: item_selector,
	add_button_text: "Создать новую группу",
	empty_message: "Пустая группа",
	replace: true,
	unordered_heading: unordered_heading,
	_put_callback: function($item) {
		sort_by_text($item.parent(), ".__name");
	},
	_save_callback: send_changes,
	edit_start: function() {
		$('h3').focusin(function() {
			prev_heading=$(this).html();
			$(this).focusout(function() {
				renames[prev_heading]=$(this).html();
			});
		});
	}
	});
{% endif %}
});


