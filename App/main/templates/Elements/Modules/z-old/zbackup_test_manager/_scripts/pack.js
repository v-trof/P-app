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


function upload_file(file_to_upload, task_index, index) {
	var file_id = test_manager.upload_queue.length;
	console.log("uplaoding file ||| id:", file_id);
	test_manager.upload_queue.push(file_id);

	var form_data = new FormData();
	form_data.append('file', file_to_upload);
	form_data.append('path', 'courses/{{course.id}}/assets/{{type}}/');
	form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
	$.ajax({
		type:"POST",
		url:"/func/upload/",
		data: form_data,
	    processData: false,
	    contentType: false,
		success:function(response) {
			test_manager.packed_test.tasks[task_index][index].url=response;
			test_manager.upload_queue.remove(file_id);

			console.log("saved to:", task_index, index, 
				test_manager.packed_test.tasks[task_index][index]);
			console.log(response, "as", file_id);
			console.log("removed", test_manager.upload_queue);
		}
	});
}

test_manager.pack = function() {
	test_manager.packed_test = {
		"title": $("h2").text(),
		tasks: []
	}
	$(".preview .__task>.__content").each(function(index, el) {
		var task_index = index;
		test_manager.packed_test.tasks[task_index] = []

		$(this).children().each(function(index, $element) {
			//this == .task.child
			var element_class = this.classList[0];
			if(element_class == '__add_to_beginning') {
				return;
			}
			index-=1;
			console.log("packing:", this);

			test_manager.packed_test.tasks[task_index].push(
				generate.read(element_class).element.parse($(this))
			);
			$(this).find("img").each(function(img_index, $element) {

				if($(this).attr('src').indexOf("blob") == 0){
					//file upload
					var assets = generate.data.shared.assets;

					var src = $(this).attr('src');
					var upload = false;

					console.log(assets);

					//find file
					for(var i=0;i<=assets.last_id;i++) {
						if(
							typeof assets[i] !== "undefined" &&
							typeof assets[i].urls !== "undefined") {
							if(assets[i].urls[0] === src) {
								upload = true;
								file_to_upload = assets[i].files[0];
							}
						}
					}

					if(upload) {
						console.log(task_index, index, img_index);
						upload_file(file_to_upload, task_index, index);
					}
					
				} else if($(this).attr('src')[0] !== '/') {
					var form_data = new FormData();
					form_data.append('file_url',$(this).attr('src'));
					form_data.append('path', 'courses/{{course.id}}/assets/{{type}}/');
					form_data.append('csrfmiddlewaretoken', '{{ csrf_token }}');
					$.ajax({
						type:"POST",
						url:"/func/upload_by_url/",
						data: form_data,
						success:function(response) {
							// console.log(response);
							test_manager.packed_test.tasks[task_index][index].url=response;
						}
					});
				}
				
			});
			$(this).find("a.m--card").each(function(img_index, $element){
				var file_id = $(this).attr("id");
				if(typeof generate.data.shared.assets[file_id] !== "undefined") {
					var file_to_upload = generate.data.shared.assets[file_id].files[0];

					// console.log(file_id, file_to_upload);

					upload_file(file_to_upload, task_index, index);
				}
			});
		});

	});
}
