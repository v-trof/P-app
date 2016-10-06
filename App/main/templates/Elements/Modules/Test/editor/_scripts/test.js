editor.test_data = {
  title: '',
  tasks: [],

  change: function(position, new_position, value) {
    // console.log('changing ', position, 'to', value);
    editor.test_data.tasks[position.task].content[position.number] = value;
    editor.test_data.delete(position);
  },
  add: function(value) {
    editor.test_data.tasks.push({
      content: [value]
    });
  },
  delete: function(position) {
    // console.log(editor.test_data.tasks[position.task], position);
    //
    editor.test_data.tasks[position.task].content = editor.test_data
                                              .tasks[position.task].content
                                              .splice(position.number+1, 1);
  }
}

pull_put.pre_actions.put = function($put_zone, $pulled) {
  editor.edit.change_state();

  console.log($put_zone, $pulled);

  var new_position = {
    task: $('.preview .__task').index($put_zone.parents('.__task')[0]),
    number: $put_zone.parent().children().index($pulled[0])
  }

  var value = editor.active_element.value;

  editor.test_data.change(new_position, editor.active_element.position, value);
}

pull_put.pre_actions.save = function() {
  editor.edit.change_state();

  var position = editor.active_element.position;
  var value = editor.active_element.value;

  editor.test_data.change(position, value);
}

pull_put.pre_actions.delete = function() {
  editor.test_data.delete( editor.active_element.position);
}
