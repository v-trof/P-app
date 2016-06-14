test_manager.publish = function() {
	popup.show('{% include "Pages/Test/editor/_popup_texts/publish/exports.html" %}', function() {
		popup.$.find(".__max_ponts").text($(".preview .__answer-field").length);
		$("#publish").click(function(){
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
				url:"/test/publish/",
				data: formData,
				processData: false,
				contentType: false,
				success: function(data){
					notification.show('success', data);
				}
			});
			$("#test_publish").hide();
			$("#test_unpublish").show();
			popup.hide();
		});
	});
}