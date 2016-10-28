editor.test_data = {
  title: '',
  tasks: [],
  templates: [],

  change: function(old_position, new_position, value) {
    // console.log('changing ', new_position, 'to', value);

    if(old_position === new_position) {
      return editor.test_data.update(old_position, value);
    }

    editor.test_data.delete(old_position);
    editor.test_data.tasks[new_position.task].content
      .splice(new_position.number, 0, value);

  },

  update: function(position, value) {
    editor.test_data.tasks[position.task].content[position.number] = value;
  },

  add: function(value) {
    editor.test_data.tasks.push({
      content: [value]
    });
  },

  delete: function(position) {
    if(!defined(position) || !defined(position.task)) return;
    // console.log('deleting:', position);
    editor.test_data
      .tasks[position.task].content
      .splice(position.number, 1);
  },

  delete_task: function(task_pos) {
    editor.test_data.tasks.splice(task_pos, 1);
  },

  insert_task: function(task_pos, value) {
    editor.test_data.tasks.splice(task_pos, 0, {content: [value]});
  }
}

pull_put.pre_actions.put = function($put_zone, $pulled) {
  if($put_zone.hasClass('__gap')) return;
  var value = editor.edit.change_value();

  var number = $put_zone.parent().children('[subtype]').index($put_zone);
  number+=1;
  var new_position = {
    task: $('.preview .__task').index($put_zone.parents('.__task')),
    number: number
  }

  editor.test_data.change(editor.active_element.position, new_position, value);
}

pull_put.pre_actions.save = function() {
  editor.edit.change_value();

  var position = editor.active_element.position;
  var value = editor.active_element.value;

  editor.edit.stop();

  $('.m--pull_put_empty').after(pull_put.ui.element);

  editor.test_data.update(position, value);
}

pull_put.pre_actions.delete = function() {
  editor.test_data.delete(editor.active_element.position);
}
