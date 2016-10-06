editor.check.numbers = function() {
  $(".preview " + ".__task .__number").each(function(index, el) {
    $(this).text(index + 1);
  });
}
