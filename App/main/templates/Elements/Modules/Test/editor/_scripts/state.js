editor.active_element = {
  is_new: undefined,
  position: {
    task: undefined,
    number: undefined
  },
  item_id: undefined,
  value: {},
  blueprints: {},
  build: function() {
    editor.edit.change_value();
    console.log('building', editor.active_element.value, 'using', editor.active_element.blueprints);
    return this.blueprints.element.build(this.value);
  }
}

pull_put.pre_actions.pull = function($pulled) {
  console.log($pulled);
  if( ! $pulled.attr('subtype')) {
    $pulled = $pulled.children();
  }

  var blueprints = generate.get_blueprints($pulled);
  editor.active_element.blueprints = blueprints;

  if($pulled.parents('.preview').length > 0) {
    editor.active_element.is_new = false;

    //TODO: calculate position
    var $task_parent = $pulled.parents('.__task');
    var position = {
      task: $('.preview .__task').index($task_parent[0]),
      number: $task_parent.find('.__content').
        children('[subtype]').index($pulled[0])
    }

    editor.active_element.position = position;

    editor.active_element.value = editor.test_data
      .tasks[position.task].content[position.number];
  } else {
    editor.active_element.is_new = true;
    editor.active_element.position.task = undefined;
    editor.active_element.position.number = undefined;
  }

  // console.log(position, editor.active_element, editor.test_data);
}

pull_put.pre_actions.cancel = function() {
  editor.edit.let(pull_put.ui.proto_element);
}

pull_put.cancel_action = function() {
  editor.active_element.is_new = false;
  editor.active_element.position.task = undefined;
  editor.active_element.position.number = undefined;
  editor.active_element.value = {};
  editor.check.empty();
  indicator.hide(1);
}
