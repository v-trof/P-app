test_manager.publish = function() {
	popup.show('{% include "Pages/Test/editor/_popup_texts/publish/exports.html" %}', function() {
		popup.$.find(".__max_ponts").text($(".preview .__answer-field").length);
		$("#publish").click(function(){
			var formData = new FormData();
			formData.append("course_id", "{{course.id}}");
			formData.append("test_id", "{{test.id}}");
			formData.append('csrfmiddlewaretoken', '{{csrf_token}}');
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