attempt.make_summary = function () {
  panel.show("");
  panel.actions.hide();

  $(".preview .__task>.__content").each(function(task_index, el) {
    var item_it = -1; //for no repeat later
    var answer_pos = 0;
    var use_full_format = false;

    var $answer_fileds = $(this).find('[type="answer"]');

    if($answer_fileds.length > 1) {
      use_full_format = true;
    }

    $answer_fileds.each(function(index, el) {
      answer_pos++;
      var value;
      var $new_summary;

      item_it+=1; //step after last found
      while (django.loaded.tasks[task_index].content[item_it].type !== "answer") {
        item_it+=1;
      }

      if(use_full_format) {
        show_index = "" + (task_index+1) + "." + (index+1);
      } else {
        show_index = task_index+1;
      }
      index++;

      //no idea where to look for values

      var $new_summary = attempt.make_summary_item(show_index, value,
                                                   answer_pos, $(this));

      panel.content.append($new_summary);

      scroll.wire($new_summary, $(this).parent().parent());
    });
  });
}
