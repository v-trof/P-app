$(document).ready(function() {
  $(".__task .__number").each(function(index, el) {
    $(this).text(index+1)
  });
});