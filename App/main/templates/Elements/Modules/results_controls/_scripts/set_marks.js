$(document).ready(function() {
  setTimeout(function() {
    function create_mark(mark, id) {
      return $('<button id="' + id + '"'
                + 'class="--ghost --' 
                + mark.quality + '">'
                + mark.value + '</button>');
    }
    var marks_info = {{marks|safe}};

    $('.group').each(function() {
      var $group = $(this);
      var group_name = $group.find('h3').text();
      for(var student_id in marks_info[group_name]) {
        var student_marks = marks_info[group_name]
          [student_id].tests;
        for(mark_id in student_marks) {
          $(".--user#" + student_id).find('.__extension')
            .append(
            create_mark(student_marks[mark_id], mark_id)
            );
        }
      }
    })
  }, 100);
});
