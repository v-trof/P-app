var course_info = {
	name: '{{course.name}}',
	subject: '{{course.subject}}',
	is_closed: false
}

$('#edit_course').click(function(event) {
	popup.show(
		'{% include "Pages/home/_popup_texts/create_course/exports.html" %}',
		function() {
			$name = $('[name="course_name"]')
			$subject = $('.--select __value')
			$is_closed = $('[name="is_closed"]')


			$name.val(course_info.name);
			$subject.val(course_info.subject);
			if(course_info.is_closed) {
				$is_closed.prop('checked', 'true');
			}

			$('#create_course_button').text('Сохранить изменения');
			//send changes
			$('#create_course_button').click(function() {
				var name = $name.val()
				var subject = $subject.val()
				var is_closed = $is_closed.is(':checked')

				$.ajax({
					url: '/func/edit_course/',
					type: 'POST',
					content_type: false,
					data: {
						'csrfmiddlewaretoken': '{{ csrf_token }}',
						'course_id': '{{course.id}}',
					},
				})
				.success(function() {
					course_info = {
						name: name,
						subject: subject,
						is_closed: is_closed
					}
				})
			})
		})
})