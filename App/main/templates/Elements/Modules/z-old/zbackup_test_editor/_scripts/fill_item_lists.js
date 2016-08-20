editor.add_to_item_list = function(element_class, $list, pull_actions) {
  var template = '<div class="card"></div>';
  //real actions
  var value_sample = generate.data[element_class]
                        .element.value_sample;

  var $element = generate.build.element(
    element_class,
    value_sample,
    {
      boundaries: []
    }
  )

  var $finished = $(template).html($element);

  pull_actions = pull_actions || []
  pull_put.puller.add(
    $element,
    pull_actions,
    generate.edit.preview_action,
    function() {
      var preview_width = $(".preview .__content").width();

      pull_put.ui.$.css("margin-left", -preview_width/2 + pull_put.ui.additional_margin);
      pull_put.ui.$.find(".__content").css("width",
        preview_width-pull_put.ui.additional_margin
      );
      
      generate.edit.start();
    },
    true,
    true);
  $finished.attr('tip', 'Кликните, чтобы создать элемент этого типа');
  $list.append($finished);
}

editor.fill_item_list = function(desired_type, $list, pull_actions) {
  for(var element_class in generate.data) {
    if(element_class == "shared") {
      continue;
    }
    var blueprint = generate.data[element_class].element;

    var type = blueprint.type;

    if( ! blueprint.nopull && type === desired_type) {
      this.add_to_item_list(element_class, $list, pull_actions)
    }
  }
}
