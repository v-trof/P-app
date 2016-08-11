{% if not attempt and not read %}

test_manager.use_new_section = false;

test_manager.add_section_binding = function() {
	test_manager.use_new_section = false;
	$new_section_name = $("#new_section_name").parent();
	$new_section_name.hide();

	var new_value = "new_section";
	var $new_section_option = $("<option value="+new_value+">Другая</option>")
	$('#course_section').parent().append($new_section_option);

	$("#course_section").change(function(event) {
		if($('#course_section').val() === new_value) {
			test_manager.use_new_section = true;
			$new_section_name.show();
		} else {
			test_manager.use_new_section = false;
			$new_section_name.hide();
		}
	});
}

test_manager.publish = function() {
	console.log("publ");
	var no_empty = ($(".preview .m--empty").length === 0);
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
			
			popup.$.find(".__max_ponts").text(test_manager.calculate_max_points());
			
			test_manager.add_section_binding();

			$("#publish").click(function() {
				var formData = new FormData();
				formData.append("course_id", "{{course.id}}");
				formData.append("test_id", "{{test.id}}");
				
				formData.append('csrfmiddlewaretoken', '{{csrf_token}}');
				
				$(".m--publish-popup .__mark-settigns")
					.find("input").each(function(index, el) {
					// console.log("m:", $(this).attr("id"), $(this).val());
					formData.append($(this).attr("id"), $(this).val())
				});

				$(".m--publish-popup .__forgive")
					.find("input").each(function(index, el) {
					// console.log("ac:", $(this).attr("id"), $(this).is(":checked"));
					formData.append($(this).attr("id"), $(this).is(":checked"))
				});

				if(test_manager.use_new_section) {
					console.log("n|", $("#new_section_name").val())
					formData.append("section", $("#new_section_name").val());
				} else {
					console.log("o|", $('#course_section').val())
					if ($('#course_section').val() != "")
						formData.append("section", $('#course_section').val());
					else formData.append("section", "Нераспределенные");
				}

			

				$.ajax({
					type:"POST",
					url:"/{{type}}/publish/",
					data: formData,
					processData: false,
					contentType: false,
					success: function(response) {
						notification.show(response["type"], response["message"]);
						$("#{{type}}_publish").hide();
						console.log("#{{type}}_publish");
						$("#{{type}}_unpublish").show();
						popup.hide();
						test_manager.save();
					}
				});
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
	console.log("publ");
	popup.show('{% include "Pages/Material/editor/_popup_texts/publish/exports.html" %}',
		function() {

		test_manager.add_section_binding();
			
		$("#publish").click(function() {
			var formData = new FormData();
			formData.append("course_id", "{{course.id}}");
			formData.append("material_id", "{{material.id}}");

			if(test_manager.use_new_section) {
				console.log("n|", $("#new_section_name").val())
				formData.append("section", $("#new_section_name").val());
			} else {
				console.log("o|", $('#course_section').val())
				if ($('#course_section').val() != "")
					formData.append("section", $('#course_section').val());
				else formData.append("section", "Нераспределенные");
			}
				
			formData.append('csrfmiddlewaretoken', '{{csrf_token}}');

			$("#{{type}}_publish").hide();
			console.log("#{{type}}_publish");
			$("#{{type}}_unpublish").show();

			console.log("ajax");
			$.ajax({
				type:"POST",
				url:"/{{type}}/publish/",
				data: formData,
				processData: false,
				contentType: false,
				success: function(response) {
					popup.hide();
					notification.show(response["type"], response["message"]);
					test_manager.save();
				}
			});
		});
	});
	
}
{% endif %}

test_manager.calculate_max_points = function() {
	var max = 0;
	$(".preview .__answer-field").each(function() {
		max += parseInt($(this).attr("worth")) || 1;
	});
	return max;
}
