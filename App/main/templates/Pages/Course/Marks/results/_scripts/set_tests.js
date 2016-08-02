$(document).ready(function() {
  var create_button = function(id, heading) {
    var $new_button = $('{% include "Pages/Course/Marks/results/linkbox/item/exports.html" %}');

    $new_button.attr('id', id);
    $new_button.find('button').text(heading);

    $new_button.click(function() {
      show_active_test(id);
      results_controls.active_test = id;
      if(results_controls.active_student) {
        results_controls.load();
      }
    });

    $('#show_summary').before($new_button);
  }

  var tests = {{tests|safe}}

  console.log(tests);
  var first_id = undefined;

  for(var test_id in tests) {
    if(!first_id) {
      first_id = test_id;
    }
    results_controls.loaded.tests[test_id] = tests[test_id];
    create_button(test_id, tests[test_id].title);
  }

  results_controls.active_test = first_id;
  setTimeout(function() {
    show_active_test('show_summary');
  }, 100);
});
