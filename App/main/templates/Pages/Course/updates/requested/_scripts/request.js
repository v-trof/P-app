// console.log('{{ user.id }}')
$( "#button_accept" ).click(function() {
	$.ajax({
		type:"POST",
		url:"/func/accept_request/",
		data: {
			   'user_id': '',
			   'csrfmiddlewaretoken': '{{ csrf_token }}',
			   'course_id': "{{course.id}}"
			  },
		success: function() {
			  notification.show('success', 'Заявка принята' );
			  $("#create_group").hide();
			   }
	});
	$("#create_group").hide();
});
$( "#button_decline" ).click(function() {
	$.ajax({
		type:"POST",
		url:"/func/decline_request/",
		data: {
			   'user_id': '',
			   'csrfmiddlewaretoken': '{{ csrf_token }}',
			   'course_id': "{{course.id}}",
			  },
		success: function() {
			  notification.show('success', 'Заявка отклонена' );
			  $("#create_group").hide();
			   }
	});
});