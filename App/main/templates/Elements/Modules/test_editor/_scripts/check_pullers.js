editor.check_pullers = function() {
  $(".preview " + this.content_selector).children().each(function(index, el) {
    if(
      (
           ! $(this).hasClass('--pullable')
        || ! $(this).hasClass('--put-zone')
      ) && ! $(this).hasClass('--empty')
    ) {
      generate.let_editing($(this));
    }
  });
}
