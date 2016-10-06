editor.fill_item_list = function($list, type) {
  var template = '<div class="card"></div>';

  for(var subtype in generate.data[type]) {
    var element_blueprint = generate.data[type][subtype];

    if(element_blueprint.element.show_in_items) {
      var $finished = $(template).html(element_blueprint.element.sample.build);
      $finished.attr('tip', 'Кликните, чтобы создать элемент этого типа');

      // console.log($finished[0], $list[0]);
      $list.append($finished);

      pull_put.puller.add(
        $finished,
        ['add'],
        editor.edit.pull_put_actions.preview,
        function() {
          var preview_width = $(".preview .__content").width();

          pull_put.ui.$.css("margin-left", -preview_width/2 + pull_put.ui.additional_margin);
          pull_put.ui.$.find(".__content").css("width",
            preview_width-pull_put.ui.additional_margin
          );

          editor.edit.start();
        },
        true,
        true);
    }
  }
}
