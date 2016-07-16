var file_to_upload = {}

var upload_source =  function() {
	
	console.log("source");

	var form_data = new FormData();
	form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
	form_data.append("course_id", "{{course.id}}");
	form_data.append("name", file_to_upload.name);
	form_data.append("link", file_to_upload.link);
	form_data.append("size", file_to_upload.size);

	$.ajax({
		url: '/func/add_source/',
		type: 'POST',
		data: form_data,
		processData: false,
	    contentType: false,
	})
	.success(function() {
		notification.show("success", "Источник загружен");
	})
	.fail(function() {
		notification.show("error", "Произошла ошибка");
	})
	
}

$("#add_source").click(function() {
	file_to_upload = {
		"name": "Без имени",
		"link": "//",
		"size": "0b",
		"catcher": {}
	}

	popup.show('{% include "Pages/Course/sources/_popup_texts/add/exports.html" %}',
	function() {
		file_to_upload.catcher = file_catcher.add($("#upload_file").parent());


		console.log("catcher", $("#upload_file"));

		$("#upload_source").click(function(event) {
			
			console.log("halo");

			var form_data = new FormData();
			form_data.append('file', file_to_upload.catcher.files[0]);
			form_data.append('path', 'courses/{{course.id}}/sources/');
			form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
			
			$.ajax({
				type:"POST",
				url:"/func/upload/",
				data: form_data,
			    processData: false,
			    contentType: false,
			})
			.success(function(file_link) {
				notification.show("success", "Файл загружен");
				file_to_upload.link = file_link;
				file_to_upload.name = $("#filename").val();
				file_to_upload.size = Math.round(file_to_upload.catcher.files[0].size/1024/1024*100)/100+"Mb";
				console.log("file", file_to_upload, "here");
				upload_source();
			})
		});
	})
});