generate.register.task('default', {
  builder: function() {
    var $task = $(loads.get("Elements/Modules/Test/generate/data/task/default/"));

    console.log($task, $task[1]);
    if(defined(generate.data.task.template)) {
      $task.find('.__make-template').click(function() {
        generate.data.task.template.to_tempalte($task);
      });
    } else {
      $task.find('.__make_template').remove();
    }

    return $task;
  }
});
