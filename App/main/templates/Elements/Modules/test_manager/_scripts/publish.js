test_manager.publish = function() {
	var no_empty = ($(".preview .--empty").length === 0);
	var answers_everywhere = true;

	console.log(no_empty, answers_everywhere, no_empty && answers_everywhere);

	$(".preview .__answer-field").each(function(index, el) {
		if( ! $(this).attr('answer')) {
			answers_everywhere = false;
		}
	});

	if(no_empty && answers_everywhere) {
		popup.show('{% include "Pages/Test/editor/_popup_texts/publish/exports.html" %}',
			function() {
			
			popup.$.find(".__max_ponts").text($(".preview .__answer-field").length);
			
			$("#publish").click(function() {
				var formData = new FormData();
				formData.append("course_id", "{{course.id}}");
				formData.append("test_id", "{{test.id}}");
				
				formData.append('csrfmiddlewaretoken', '{{csrf_token}}');
				$(".--publish-popup .__mark-settigns")
					.find("input").each(function(index, el) {
					// console.log("m:", $(this).attr("id"), $(this).val());
					formData.append($(this).attr("id"), $(this).val())
				});

				$(".--publish-popup .__forgive")
					.find("input").each(function(index, el) {
					// console.log("ac:", $(this).attr("id"), $(this).is(":checked"));
					formData.append($(this).attr("id"), $(this).is(":checked"))
				});

				$.ajax({
					type:"POST",
					url:"/{{type}}/publish/",
					data: formData,
					processData: false,
					contentType: false,
					success: function(data) {
						notification.show('success', data);
					}
				});

				$("#{{type}}_publish").hide();
				$("#{{type}}_unpublish").show();
				popup.hide();
			});
		});

	} else {
		popup.show('{% include "Pages/Test/editor/_popup_texts/no_publish/exports.html" %}',
			function() {
			$(".__ok").click(function(event) {
				popup.hide();
			});
		});
	}
}

test_manager.publish_material = function() {
	var formData = new FormData();
	formData.append("course_id", "{{course.id}}");
	formData.append("material_id", "{{material.id}}");
		
	formData.append('csrfmiddlewaretoken', '{{csrf_token}}');

	$.ajax({
		type:"POST",
		url:"/{{type}}/publish/",
		data: formData,
		processData: false,
		contentType: false,
		success: function(data) {
			notification.show('success', data);
		}
	});
}