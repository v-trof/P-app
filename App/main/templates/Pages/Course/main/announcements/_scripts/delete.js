function announcement_delete(id) {
	console.log("dsf");
	$.ajax({
		type:"POST",
		url:"/func/delete_announcement/",
		data: {
			'csrfmiddlewaretoken': '{{ csrf_token }}',
			'course_id': "{{course.id}}",
			'announcement_id': id,
		},
		success: function(response) {
			notification.show("success", "Удалено");
		},
		error: function(data) {
			console.log(data);
			notification.show('error','Произошла ошибка');						
		}
	});
}
