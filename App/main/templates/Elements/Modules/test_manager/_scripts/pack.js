Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

test_manager.pack = function() {
	console.log("packing")
	test_manager.packed_test = {
		"title": $("h2").text(),
		tasks: []
	}
	$(".preview"
		+ "{% if type == 'test' %} .__task{% endif %}"
		+ ">.__content" 
		+ "{% if type != 'test' %}>.card{% endif %}"
	).each(function(index, el) {
		var task_index = index;
		test_manager.packed_test.tasks[task_index] = []

		$(this).children().each(function(index, $element) {
			//this == .task.child
			console.log(this);
			var element_class = $(this)
				.attr('class').split(' ')[0];

			test_manager.packed_test.tasks[task_index].push(
				generate.read(element_class).element.parse($(this))
			);
			$(this).find("img").each(function(index, $element) {
				if($(this).attr('src').indexOf("blob") == 0){
					//file upload
					var assets = generate.data.shared.assets;

					var src = $(this).attr('src');
					var upload = false;
					var upload_file;

					//find file
					for(var i=1;i<=assets.last_id;i++) {
						if(typeof assets[i] != "undefined") {
							if(assets[i].urls[0] == src) {
								upload = true;
								upload_file = assets[i].files;
							}
						}
					}

					// console.log("file", upload);

					if(upload) {

						var file_id = test_manager.upload_queue.length;
						console.log("uplaodigng file ||| id:", file_id);
						test_manager.upload_queue.push(file_id);

						var form_data = new FormData();
						form_data.append('file', upload_file[0]);
						form_data.append('path', 'courses/{{course.id}}/assets/{{type}}/');
						form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
						$.ajax({
							type:"POST",
							url:"/func/upload/",
							data: form_data,
						    processData: false,
						    contentType: false,
							success:function(response) {
								console.log(response, "as", file_id);
								test_manager.packed_test.tasks[task_index][index].url=response;
								test_manager.upload_queue.remove(file_id);
								console.log("removed", test_manager.upload_queue);
							}
						});
					}
					
				} else {
					var form_data = new FormData();
					form_data.append('file_url',$(this).attr('src'));
					form_data.append('path', 'courses/{{course.id}}/assets/{{type}}/');
					form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
					$.ajax({
						type:"POST",
						url:"/func/upload_by_url/",
						data: form_data,
						success:function(response) {
							console.log(response);
							test_manager.packed_test.tasks[task_index][index].url=response;
						}
					});
				}
				
			});
		});

	});
}