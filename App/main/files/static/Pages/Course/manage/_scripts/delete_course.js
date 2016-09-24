$("#delete_course").click(function(event) {
  $.ajax({
    url: '/func/delete_course/',
    type: 'POST',
    content_type: false,
    data: {
      'csrfmiddlewaretoken': '{{ csrf_token }}',
      'course_id': "{{course.id}}",
    },
  })
  .success(function() {
    window.location.href=("/");
  })
});