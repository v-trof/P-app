$(document).ready(function() {
  editor.fill_item_list("question", $(".item-list.--question"));
  editor.check_self();
});

$(document).on('click', 'button', editor.check_self);
