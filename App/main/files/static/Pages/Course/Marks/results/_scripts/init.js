$(document).ready(function() {
{% if test_id %}
  results_controls.active_test = '{{test_id}}';
{% endif %}
  sort_by_text($(".students"), "h3");
  $(".students .group").each(function() {
    sort_by_text($(this), '.__name');
  });
});
