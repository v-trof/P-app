$('.--assignment').each(function(index, el) {
	var id = $(this).attr("id").split("_")[1];

	button_delete.add($(this), function() {
		//ajax to delete
		$.ajax({
			type: "POST",
			url: '/func/delete_assignment/',
			data: {
				'course_id': '{{course.id}}',
				'assignment_id': "" + id,
				'csrfmiddlewaretoken': '{{ csrf_token }}'
			}
		})
		.success(function() {
			notification.show("success","Задание удалено")
		})
		
	});

	$(this).find('.--button-delete').addClass('--l-2');
});