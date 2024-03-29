function show_marks($group) {
   function create_mark(mark, id) {
    if (mark == 0) {
      mark = {};
      mark.quality = 'grey';
      mark.value = '–';
    }
    return $('<button test="' + id + '"'
              + 'class="m--ghost m--' 
              + mark.quality + '">'
              + mark.value + '</button>');
  }
  var marks_info = {{marks|safe}};
  // console.log(marks_info);
  var group_name = $group.find('h3').text();



  for(var student_id in marks_info[group_name]) {
    var student_marks = marks_info[group_name]
      [student_id].tests;
    for(mark_id in student_marks) {
      var $user_card = $('[href$="/' + student_id+'"]').parent();
       // console.log('[href$="/' + student_id+'"]',$user_card)
      if( ! results_controls.active_student) {
        results_controls.active_student = student_id;
        $user_card.addClass('m--active');
      }

      $user_card.find('.__extension')
        .append(
          create_mark(student_marks[mark_id], mark_id)
        );
    }
  }
  plug_marks_init($group);
}
