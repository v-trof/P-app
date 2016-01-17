var editing = false;
function toggle_edit(){
	if(editing){
		$("h3").css('border-bottom', '1px dashed transparent').attr("contenteditable", "false");
		$(".card-person").attr("draggable", "false");
		editing = false;
	} else {
		$("h3").css('border-bottom', '1px dashed #2196F3').attr("contenteditable", "true");
		$(".card-person").attr("draggable", "true");
		editing = true;
	}
}

$(document).ready(function() {
	$("h3").css('border-bottom', '1px dashed transparent');
	$("#edit").click(function(event) {
		toggle_edit();
	});
	$("#invite_teacher").click(function(event) {
		popup.show("<input type='email' id='email'><label for='email' required>Email</label><br><br><button id='invite_teacher_button'>Пригласить</button>",
		{"width":"20rem"},
		function(){
			add_menu_caller($("#popup .select").get(0));
			$("#popup input")[0].focus();
			$("#invite_teacher_button").click(function(event) {
				var formData = new FormData();
				formData.append('email', $("#email").val());
				formData.append('course', "{{course.title_lat}}");
				formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
				$.ajax({
					type:"POST",
					url:"/func/add_teacher/",
					data: formData,
					processData: false,
					contentType: false,
					success: function(){
						notification.change('success','Преподаватель приглашен','Ждем от него подтвкерждения' );
					}
			});
			});
		});
	});
	$("#invite_students").click(function(event) {
		popup.show("<input type='email' class='student__email'>" +
			"<label for='email'>Email</label><br>" +
			"<button class='button--icon' id='add_student'><svg  viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/><path d='M0 0h24v24H0z' fill='none'/></svg></button>" +
			"<div class='select'><div class='display'>Нераспределенные</div>" +
			"<svg class='{{ class }}' id='{{id}}' viewBox='0 0 24 24'  xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>" +
			"<input type='hidden' name='subject' class='value'>" +
			"<option value='unordered'>Нераспределенные</option>" +
			"<option value='10I'>10И</option>" +
			"<option value='10D'>10Б</option></div>" +
			"<br><br><br><button id='invite_students_button'>Пригласить</button>",
		{"width":"20rem"},
		function(){
			add_menu_caller($("#popup .select").get(0));
			$("#popup input")[0].focus();
			$("#add_student").click(function(e){
				$("#popup .student__email+label").last().after("<input type='email' class='student__email'><label for='email'>Email</label>");
				add_emptiness_checker($("#popup .student__email").last()[0]);
			});
			$("#invite_students_button").click(function(e) {
				var formData = new FormData();
				var email_list=[];
				$("#popup .student__email").each(function(index, el) {
					email_list.push($(this).val());
				});
				console.log(email_list.join(","), email_list);
				formData.append('email_list', email_list.join(","));
				formData.append('course', "{{course.title_lat}}");
				formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
				$.ajax({
					type:"POST",
					url:"/func/add_teacher/",
					data: formData,
					processData: false,
					contentType: false,
					success: function(){
						notification.change('success','Преподаватель приглашен','Ждем от него подтвкерждения' );
					}
			});
			});
		});
	});
});