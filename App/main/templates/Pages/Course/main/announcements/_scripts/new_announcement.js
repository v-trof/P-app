{% if request.user.id == course.creator %}
$(document).ready(function() {
	$("#add_announcement").click(function() {
		popup.show('{% include "Pages/Course/main/_popup_texts/add_announcement/exports.html" %}');
		$("#add_el").click(function(event) {
			var new_heading = $('[name="heading"]').val();
			var new_text = $('.announcement_text').html();
			$.ajax({
				type:"POST",
				url:"/func/add_announcement/",
				data: {
					'csrfmiddlewaretoken': '{{ csrf_token }}',
					'text': new_text,
					'heading': new_heading,
					'course_id': "{{course.id}}",
				},
				success: function(response) {
					popup.hide();
					notification.show('success','Объявление добавлено');
					if($(".announcements .card").length === 0) {
						$(".announcements").html($(".announcements h3"));
					}

					var $new_announcement = $('{% include "Elements/card/exports.html" %}');
					$(".announcements").append($new_announcement);
					$new_announcement.attr("id",response);
					$new_announcement.find(".__heading").text(new_heading);
					$new_announcement.find(".__content").text(new_text);

					$(".announcements").show();

					button_delete.add($new_announcement, function() {
						announcement_delete(response);
					});
				},
				error: function() {
					notification.show('error','Произошла ошибка');						
				}
			});
		});
	});
});

{% endif %}
