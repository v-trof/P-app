function show_marks($group) {
   function create_mark(mark, id) {
    return $('<button id="' + id + '"'
              + 'class="--ghost --' 
              + mark.quality + '">'
              + mark.value + '</button>');
  }
  var marks_info = {{marks|safe}};

  var group_name = $group.find('h3').text();



  for(var student_id in marks_info[group_name]) {
    var student_marks = marks_info[group_name]
      [student_id].tests;
    for(mark_id in student_marks) {
      var $user_card = $(".--user#" + student_id);
      if( ! results_controls.active_student) {
        results_controls.active_student = student_id;
        $user_card.addClass('--active');
      }

      $user_card.find('.__extension')
        .append(
          create_mark(student_marks[mark_id], mark_id)
        );
    }
  }
  plug_marks_init($group);
}
