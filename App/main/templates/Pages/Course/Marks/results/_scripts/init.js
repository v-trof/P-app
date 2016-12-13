var False = false;
var True = true;

var django = {
  course: {
    id: "{{course.id}}"
  },
  test: {
    id: "{{test.id}}"
  },
  material: {
    id: "{{material.id}}"
  },
  csrf_token: "{{ csrf_token }}",
  current_type: "{{type}}"
}

$(document).ready(function() {
{% if test_id %}
  results_controls.active_test = '{{test_id}}';
{% endif %}
  sort_by_text($(".students"), "h3");
  $(".students .group").each(function() {
    sort_by_text($(this), '.__name');
  });
});
