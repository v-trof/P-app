function ajax_create(data) {
	$.ajax({
		type:"POST",
		url:"/func/create_assignment/",
		data: data,
		success: function(data) {
			if (data["type"]=="success")
			{
				window.location.href=data["redirect"]
			}
			else{
				notification.show(data)
			}
		}
	});
}