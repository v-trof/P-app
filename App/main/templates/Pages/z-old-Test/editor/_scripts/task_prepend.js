function prepend_margin($task) {
  var $putzone = $('<div class="__put-margin"></div>');
  $task.before($putzone);

  indicator.add($putzone, 'add', 1);

  generate.edit.add_put_zone($putzone, function($this, $pulled) {
    var $new_task = generate.build.task($pulled);
    $putzone.before($new_task);
    $new_task.before($(".__put-margin").last());
    editor.check_self();
  });

  return $putzone;
}
