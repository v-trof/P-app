{% if request.user.id == course.creator %}

$(document).ready(function() {
	$(".announcements").on("click", ".card", function() {
		var $original = $(this);
		popup.show('{% include "Pages/Course/main/_popup_texts/add_announcement/exports.html" %}', function() {
			
			//change to edit & autofill
			$("#add_el").text("Сохранить");
			$('.announcement_text').html(
				$original.find(".__content").html()).focus();
			$('[name="heading"]').val(
				$original.find(".__heading").text()).focus();

			//saving
			$("#add_el").click(function(event) {
				var id = $original.attr('id');
				var new_heading = $('[name="heading"]').val();
				var new_text = $('.announcement_text').html();

				$.ajax({
					type:"POST",
					url:"/func/edit_announcement/",
					data: {
						'csrfmiddlewaretoken': '{{ csrf_token }}',
						'text': new_text,
						'heading': new_heading,
						'course_id': "{{course.id}}",
						'announcement_id': id,
					},
					success: function(response) {
						popup.hide();
						$original.find(".__content").html(new_text);
						$original.find(".__heading").html(new_heading);
						notification.show("success", "Сохранено");
					},
					error: function() {
						notification.show('error','Произошла ошибка');						
					}
				});
			});
		});

	});

	$(".announcements>.card").each(function(index, el) {
		var id = $(this).attr("id");
		button_delete.add($(this), function() {
			announcement_delete(id);
		});
	});
});

{% endif %}