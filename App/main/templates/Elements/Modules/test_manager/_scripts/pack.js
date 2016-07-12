

test_manager.pack = function() {
	console.log("packing")
	var test_json = {
		"title": $("h2").text(),
		tasks: []
	}
	$(".preview .__task .__content").each(function(index, el) {
		var task_index = index;

		test_json.tasks[task_index] = []

		$(this).children().each(function(index, $element) {
			//this == .task.child
			console.log(this);
			var element_class = $(this)
				.attr('class').split(' ')[0];

			test_json.tasks[task_index].push(generate.read(element_class)
				.element.parse($(this)));

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

					console.log("file", upload);

					if(upload) {
						//create formdata and stuff pls it's 00:45 already
						$.ajax({
							type:"POST",
							url:"func/upload_file",
							data: {
								'file': upload_file,
								'course_id':'{{course.id}}',
								'test_id':'{{test.id}}',
								'csrfmiddlewaretoken' : '{{ csrf_token }}'
							},
							success:function(response) {
								test_json[task_index].question_items[index].url=response;
							}
						});
					}
					
				} else {
					//url uplaod
					$.ajax({
						type:"POST",
						url:"/test/upload_by_url/",
						data: {
							'asset_url':$(this).attr('src'),
							'course_id':'{{course.id}}',
							'test_id':'{{test.id}}',
							'csrfmiddlewaretoken' : '{{ csrf_token }}'
							},
						success:function(response) {
							test_json[task_index].question_items[index].url=response;
						}
					});
				}
				
			});
		});

	});
	return JSON.stringify(test_json);
}