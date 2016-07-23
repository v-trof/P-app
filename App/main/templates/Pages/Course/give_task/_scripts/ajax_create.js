function ajax_create(data) {
	$.ajax({
		type:"POST",
		url:"/func/create_assignment/",
		data: data,
		success: function(data) {
			notification.show('success','Задание создано' );
			loaded = true;
			task_id = data;
			$("#give_task").text("Сохранить изменения");
		}
	});
}