$(document).ready(function() {
  $('.preview').on('keyup', 'h2', function() {
    editor.test_data.title = $(this).text();
  });

  $('.preview').on('keyup', '.__task .__group', function() {
    var task_n = $('.preview .__task').index($(this).parents('.__task'));
    editor.test_data.tasks[task_n].group = this.value;
  });
});
