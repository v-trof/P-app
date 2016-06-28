$(document).ready(function() {
	$("#add_announcement").click(function() {
		popup.show('{% include "Pages/Course/main/_popup_texts/add_announcement/exports.html" %}');
		$("#add_el").click(function(event) {
			var new_heading = $('[name="heading"]').val();
			var new_text = $('.announcement_text').text();
			$.ajax({
				type:"POST",
				url:"/func/add_announcement/",
				data: {
					'csrfmiddlewaretoken': '{{ csrf_token }}',
					'text': new_text,
					'heading': new_heading,
					'course_id': "{{course.id}}",
				},
				success: function() {
					popup.hide();
					notification.show('success','Объявление добавлено');
					$(".announcements").append('{% include "Elements/card/exports.html" %}');
					$(".announcements .card:last-child .__overall-info .__heading").text(new_heading);
					$(".announcements .card:last-child .__content").text(new_text);
				},
				error: function() {
					notification.show('error','Произошла ошибка');						
				}
			});
		});
	});
});