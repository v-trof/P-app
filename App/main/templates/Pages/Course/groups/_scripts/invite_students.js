var invite_students_text = '{% include "Pages/Course/groups/_popup_texts/invite_students/exports.html" %}'

$("#invite_students").click(function(event) {
	popup.show(invite_students_text);
	$(".student__email").focus();
	verifier.add($(".student__email"), "email");
	$("#add_student").click(function(e) {
		$(".__content .m--text").last().after('<div class="input m--text"><input class="student__email __value" type="email"><label>Email</label><div class="__indicator"></div></div>');
  		verifier.add($(".m--text").last().children(".student__email"), "email");
	});

	var catcher = file_catcher.add($('.email_file').parent());

	$("#invite_students_button").click(function(e) {
			var formdata = new FormData();
			var email_list=[];


			$(".student__email").each(function(index, el) {
				if($(this).val()){
					email_list.push($(this).val());
				}
			});
			var group=$(".m--select").children(".__display").text();
			if (group=="Выберите...") group="Нераспределенные";
			formdata.append('csrfmiddlewaretoken', '{{ csrf_token }}');
			formdata.append('course_id', '{{ course.id }}');
			formdata.append('email_list', JSON.stringify(email_list));
			formdata.append('group', group);
			if(catcher.files) {
				formdata.append('email_file', catcher.value[0].files[0]);
			}
			for (var pair of formdata.entries()) {
			    console.log(pair[0]+ ', ' + pair[1]); 
			}
			$.ajax({
				type:"POST",
				url:"/func/invite_students/",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(response) {
            if(response && response["type"]) {
            	if(response.type == "success") {
            		popup.hide();
            	}
              notification.show(response["type"], response["message"]);
            } else {
							popup.hide();
							notification.show('success', 
								'Ученики приглашены, ждем от них подтверждения' );
						}
				},
		});
		});
});
