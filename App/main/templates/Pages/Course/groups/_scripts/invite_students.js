$("#invite_students").click(function(event) {
	popup.show('{% include "Pages/Course/groups/_popup_texts/invite_students/exports.html" %}');
	$(".student__email").focus();
	verifier.add($(".student__email"), "email");
	$("#add_student").click(function(e) {
		$(".__content .--text").last().after('<div class="input --text"><input class="student__email __value" type="email"><label>Email</label><div class="__indicator"></div></div>');
  		verifier.add($(".--text").last().children(".student__email"), "email");
	});
	$("#invite_students_button").click(function(e) {
			var email_list=[];
			$(".student__email").each(function(index, el) {
				email_list.push($(this).val());
			});
			var group=$(".--select").children(".__display").text();
			if (group=="Выберите...")
				group="Нераспределенные";
			$.ajax({
				type:"POST",
				url:"/func/invite_students/",
				data: {
					'csrfmiddlewaretoken': '{{ csrf_token }}',
					'email_list':JSON.stringify(email_list),
					'course_id':"{{course.id}}",
					'group':group,
				},
				success: function() {
					popup.hide();
					notification.show('success','Ученики приглашены, ждем от них подтверждения' );
				},
		});
		});
});