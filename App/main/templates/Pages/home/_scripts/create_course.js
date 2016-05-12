var create_course_html = "<input type='text' name='course_name'><label for='course_name' required>Название курса</label><br><br>"+
	"<input type='checkbox' id='is_closed' name='is_closed'><label for='is_closed'>Закрытый (Доступ к курсу только по приглашению)</label><br>"+
	"<div class='select'><div id='subject' class='display'>Русский язык</div>"+
	"<svg class='{{ class }}' id='{{id}}' viewBox='0 0 24 24'  xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>" +
	"<input type='hidden' name='subject' class='value'><option value='russian'>Русский язык</option>" +
	"<option value='literature'>Литература</option>"+
	"<option value='math'>Математика</option></div>" +
	"<br><br><button id='create_course_button'>Создать</button>";

$(document).ready(function() {
	$("#create_course").click(function() {
		popup.show(create_course_html);
		$( "#create_course_button" ).click(function() {
  			if( $("input[name=course_name]").val() == ""){
			$("input[name=course_name]").attr('invalid', "true")
				tooltip.show($("input[name=course_name]")[0], "У курса должно быть название")
				return 0
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