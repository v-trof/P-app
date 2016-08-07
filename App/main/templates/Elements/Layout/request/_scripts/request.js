//accept request
$(document).on("click", "#button_accept", function() {
	console.log("accpt")
	$.ajax({
		type:"POST",
		url:"/func/accept_request/",
		data: {
			   'user_id': $(this).attr("data-user-id"),
			   'csrfmiddlewaretoken': '{{ csrf_token }}',
			   'course_id': "{{course.id}}"
			  },
		success: function() {
			notification.show('success', 'Заявка принята' );
		},
		error: function(data) {
			notification.show('error', data);
		}
	});
	$(this).closest(".card").hide();
});

//rejqct request
$(document).on("click", "#button_decline", function() {
	$.ajax({
		type:"POST",
		url:"/func/decline_request/",
		data: {
			   'user_id': $(this).attr("data-user-id"),
			   'csrfmiddlewaretoken': '{{ csrf_token }}',
			   'course_id': "{{course.id}}",
			  },
		success: function() {
			  notification.show('success', 'Заявка отклонена' );
		},
		error: function(data) {
			notification.show('error', data);
		}
	});
	$(this).closest(".card").hide();
});
