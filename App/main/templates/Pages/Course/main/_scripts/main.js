$(document).ready(function() {
	$("#add_announcement").click(function(){
		popup.show('{% include "Pages/Course/main/_popup_texts/add_announcement/exports.html" %}');
		$("#add_el").click(function(event) {
			var new_heading = $('[name="heading"]').val();
			console.log(new_heading);
			var new_text = $('.announcement_text').text();
			$.ajax({
	            type:"POST",
	            url:"/func/add_announcement/",
	            data: {
	                   'csrfmiddlewaretoken': '{{ csrf_token }}',
	                   'text': new_text,
	                   'heading': new_heading,
	                   'course_id': "{{course.id}}",
	                  },
	            success: function(){
	            	popup.hide();
	            	notification.show('success','Объявление добавлено');
	            	var card='{% include "Elements/card/exports.html" with content=new_text heading=new_heading %}';
					console.log(card);
					$( ".announcements" ).append(card);
	            },
	            error: function(){
	            	notification.show('error','Произошла ошибка');		            	
	            }
            });
		});
	});
});