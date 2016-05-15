$(document).ready(function() {
	$("#create_course").click(function() {
		popup.show('{% include "Pages/home/_popup_texts/create_course/exports.html" %}');
		$( "#create_course_button" ).click(function() {
  			if( $("input[name=course_name]").val() == ""){
			$("input[name=course_name]").attr('invalid', "true");
				tooltip.show($("input[name=course_name]")[0], "У курса должно быть название");
				return 0;
			}
  			$.ajax({
	            type:"POST",
	            url:"/func/create_course/",
	            data: {
	                   'csrfmiddlewaretoken': '{{ csrf_token }}',
	                   'course_name': $("input[name=course_name]").val(),
	                   'subject': $('#subject').text(),
	                  },
	            success: function(response){
	                  window.location.href = response;
	                   }
	            });
		});
		});
});