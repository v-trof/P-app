editor.check_self = function() {
  editor.check.numbers();
  editor.check_empty();
  editor.check_pullers();
}

$(document).on('click', 'button', editor.check_self);
