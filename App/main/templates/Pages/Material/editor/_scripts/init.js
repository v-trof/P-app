$(document).ready(function() {
  editor.fill_item_list("question", $(".item-list.--question"));
  editor.check_self();
  $(".__task .__number").remove();
});
