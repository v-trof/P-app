editor.check_numbers = function() {
  $(".preview " + this.number_selector).each(function(index, el) {
    $(this).text(index + 1);
  });
}
