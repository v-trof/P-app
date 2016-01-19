var create_course_html = "<form><input type='text' name='course_name'><label for='course_name' required>Название курса</label><br><br>"+
	"<input type='checkbox' id='is_closed' name='is_closed'><label for='is_closed'>Закрытый (Доступ к курсу только по приглашению)</label><br>"+
	"<div class='select'><div class='display'>Русский язык</div>"+
	"<svg class='{{ class }}' id='{{id}}' viewBox='0 0 24 24'  xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>" +
	"<input type='hidden' name='subject' class='value'><option value='russian'>Русский язык</option>" +
	"<option value='literature'>Литература</option>"+
	"<option value='math'>Математика</option></div>" +
	"</br></br></br><button id='create_course_button'>Создать</button></form>";

$(document).ready(function() {
	$("#create_course").click(function() {
		popup.show(create_course_html,
		{},
		function() {
			add_menu_caller($("#popup .select").get(0));
			$("#popup input")[0].focus();
		});
	});
});