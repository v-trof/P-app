var invite_students_text = '{% include "Pages/Course/groups/_popup_texts/invite_students/exports.html" %}'

$("#invite_students").click(function(event) {
	popup.show(invite_students_text);
	$(".student__email").focus();
	verifier.add($(".student__email"), "email");
	$("#add_student").click(function(e) {
		$(".__content .m--text").last().after('<div class="input m--text"><input class="student__email __value" type="email"><label>Email</label><div class="__indicator"></div></div>');
  		verifier.add($(".m--text").last().children(".student__email"), "email");
	});
	$("#invite_students_button").click(function(e) {
			var email_list=[];
			$(".student__email").each(function(index, el) {
				email_list.push($(this).val());
			});
			var group=$(".m--select").children(".__display").text();
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
