summary.make = function (test, attempt, make_summary_item) {
  console.log('making');
  panel.show("");
  panel.actions.hide();
  var global_answer_pos = 0;
  $(".preview .__task>.__content").each(function(task_index, el) {
    var item_it = -1; //for no repeat later
    var answer_pos = 0;
    var use_full_format = false;

    var $answer_fields = $(this).find('[type="answer"]');

    if($answer_fields.length > 1) {
      use_full_format = true;
    }

    $answer_fields.each(function(index, el) {
      answer_pos+=1;
      global_answer_pos+=1;
      var value;
      var $new_summary;
      var $current_task = $(this).parent().parent();
      console.log($current_task);

      item_it+=1; //step after last found
      while (test.tasks[task_index].content[item_it].type !== "answer") {
        item_it+=1;
      }

      if(use_full_format) {
        show_index = "" + (task_index+1) + "." + (index+1);
      } else {
        show_index = task_index+1;
      }
      index++;

      var real_index = global_answer_pos - 1;

      value = attempt[real_index].user_answer;
      var $new_summary = make_summary_item(show_index, value,
                                           real_index, $(this),
                                           attempt[real_index]);
      panel.content.append($new_summary);


      scroll.wire($new_summary, $current_task);
    });
  });
}
