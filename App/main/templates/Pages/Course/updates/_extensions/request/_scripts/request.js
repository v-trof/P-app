$( "#button_accept" ).click(function() {
	$.ajax({
		type:"POST",
		url:"/func/accept_request/",
		data: {
			   'user_id': $(this).attr("data-user-id"),
			   'csrfmiddlewaretoken': '{{ csrf_token }}',
			   'course_id': "{{course.id}}"
			  },
		success: function(){
			notification.show('success', 'Заявка принята' );
			   }
	});
	$(this).closest(".card").hide();
});
$( "#button_decline" ).click(function() {
	$.ajax({
		type:"POST",
		url:"/func/decline_request/",
		data: {
			   'user_id': $(this).attr("data-user-id"),
			   'csrfmiddlewaretoken': '{{ csrf_token }}',
			   'course_id': "{{course.id}}",
			  },
		success: function(){
			  notification.show('success', 'Заявка отклонена' );
			   }
	});
	$(this).closest(".card").hide();
});