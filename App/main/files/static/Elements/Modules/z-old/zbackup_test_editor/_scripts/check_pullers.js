editor.check_pullers = function() {
  $(".preview " + this.content_selector).children().each(function(index, el) {
    if(
      (
           ! $(this).hasClass('m--pullable')
        || ! $(this).hasClass('m--put-zone')
      ) && ! $(this).hasClass('m--empty')
    ) {
      generate.let_editing($(this));
    }
  });
}
