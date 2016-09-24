results_display.set_numbers = function() {
  $(".__task .__number").each(function(index, el) {
    $(this).text(index+1)
  });
};
