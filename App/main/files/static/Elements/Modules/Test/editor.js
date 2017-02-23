/**
 * Modules/Test/editor/ | supports test\material editing
 * @namespace
 */
var editor = {
  /**
   * Editor integrity and display related functions
   * @namespace
   */
  check: {

  },
  /**
   * Element editing functinos
   * @namespace
   */
  edit: {

  },
  template_ui: {}
}

$(document).ready(function() {
  editor.template_ui.$ = $(
      loads.get('Elements/Modules/Test/editor/__template_ui/'));
  $('body').append(editor.template_ui.$);

  editor.template_ui.$.find('.m--close').click(function() {
    editor.template_ui.hide();
  })
});

editor.insert_new_task = function($gap) {
  var position = $('.preview>.__content .__gap').index($gap[0]);
  if(pull_put.ui.$.find(".__content").attr('state') === 'edit') {
    editor.edit.change_value();
  }

  if(defined(editor.active_element.value)) {
    var $element = editor.active_element.build();

    var $new_task = editor.create_new_task();

    $gap.before($new_task);
    $new_task.find('.__content').append($element);

    editor.test_data.delete(editor.active_element.position);
    editor.test_data.insert_task(position, editor.active_element.value);

    editor.check.numbers();
    editor.check.empty();
  }
}

editor.create_new_task = function() {
  var $new_task = generate.data.task.default.build();
  var $gap = $($new_task[0])
  var $catcher = $('<div class="__catcher"></div>');

  pull_put.put_zone.add($gap, function() {
    editor.insert_new_task($gap);
    pull_put.reset();
  });
  indicator.add($gap, 'add', 1);

  $new_task.find('.__content').prepend($catcher);
  pull_put.put_zone.add(
    $catcher,
    function(e, $this, $pulled) {
      $this.after(editor.active_element.build());
      pull_put.reset();
    }

  )
  indicator.add($catcher, 'add', 1);


  var $actions = $new_task.find('.__overall>.__actions');

  button_delete.add($actions, $new_task, function() {
    var task_pos = $('.preview .__task').index($new_task[1]);

    editor.test_data.delete_task(task_pos);

    setTimeout(editor.check.numbers, 150);
  });

  $new_task.find('.m--button-delete').removeClass('m--button-delete');

  return $new_task;
}

$(document).ready(function() {
  pull_put.actions.add = function() {
    if(pull_put.ui.$.find(".__content").attr('state') === 'edit') {
      editor.edit.change_value();
    }

    if(defined(editor.active_element.value)) {
      var $element = editor.active_element.build();

      var $new_task = editor.create_new_task();

      $('.preview>.__content').append($new_task);
      $new_task.find('.__content').append($element);

      editor.test_data.add(editor.active_element.value,
        editor.active_element.type, editor.active_element.subtype);

        editor.check.numbers();
        editor.check.empty();
      }

      if(defined(editor.active_element.position)) {
        editor.test_data.delete(editor.active_element.position);
      }
    }
});

editor.assets = {
  _files: [],
  add: function(content) {
    var pos = this._files.length;
    this._files.push(content);

    return pos;
  },

  get: function(pos) {
    return this._files[pos];
  },

  replace: function(pos, content) {
    this._files[pos] = content;
  }
}

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

$(document).ready(function() {
  $('.preview').on('keyup', 'h2', function() {
    editor.test_data.title = $(this).text();
  });

  $('.preview').on('keyup', '.__task .__group', function() {
    var task_n = $('.preview .__task').index($(this).parents('.__task'));
    editor.test_data.tasks[task_n].group = this.value;
  });
});

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
$(document).ready(function() {
  pull_put.pre_actions.pull = function($pulled) {
    if( ! $pulled.attr('subtype')) {
      $pulled = $pulled.children();
    }

    var blueprints = generate.get_blueprints($pulled);
    editor.active_element.blueprints = blueprints;

    if($pulled.parents('.preview').length > 0) {
      editor.active_element.is_new = false;

      var $task_parent = $pulled.parents('.__task');
      var position = {
        task: $('.preview .__task').index($task_parent[0]),
        number: $task_parent.find('.__content').
          children('.generate-item').index($pulled[0])
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
});

editor.test_data = {
  title: '',
  tasks: [],
  templates: [],

  change: function(old_position, new_position, value) {
    console.log('changing ', new_position, 'to', value);
    console.log('changed form ', old_position);

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

  add_template: function(template) {
    template.is_template = true;
    editor.test_data.tasks.push(template);
  },

  delete: function(position) {
    if(!defined(position) || !defined(position.task)) return;
    editor.test_data
      .tasks[position.task].content
      .splice(position.number, 1);
  },

  delete_task: function(task_pos) {
    editor.test_data.tasks.splice(task_pos, 1);
  },

  insert_task: function(task_pos, value) {
    editor.test_data.tasks.splice(task_pos, 0, {content: [value]});
  },

  //template methods
  templates_remove: function(template) {
    editor.test_data.templates
      .splice(editor.test_data.templates.indexOf(template), 1);

    $('.preview .__task.m--template').each(function() {
      var $task = $(this);
      var group = $task.find('.__group').val();

      console.log('checking', this, '(' + group + ')', '=>',
        editor.test_data.template_get_parts(group));

      if( ! editor.test_data.template_get_parts(group)) {
        //going DRY
        $task.find('.__serialize').click();
      }
    });
  },

  template_get_parts: function(group) {
    for(var i = 0; i < editor.test_data.templates.length; i++) {
      if(editor.test_data.templates[i].group === group) {
        return editor.test_data.templates[i].parts;
      }
    }

    return false;
  }
}

editor.test_data.templates.save = function(new_tempalte, old_group) {
  new_tempalte = JSON.parse(JSON.stringify(new_tempalte));

  console.log('saving', new_tempalte, 'as', old_group);

  for(var i = 0; i < editor.test_data.templates.length; i++) {
    if(editor.test_data.templates[i].group === old_group) {
      editor.test_data.templates[i] = new_tempalte;
      saved = true;
    }
  }
}

editor.test_data.templates.add = function(new_tempalte) {
  var was = false;
  var new_group = new_tempalte.group;

  console.log('adding', new_tempalte);

  new_tempalte = JSON.parse(JSON.stringify(new_tempalte));

  for(var i = 0; i < editor.test_data.templates.length; i++) {
    if(editor.test_data.templates[i].group === new_tempalte.group) {
      was = true;
    }
  }

  if(was) {
    new_group = new_group + '+';
    new_tempalte.group = new_group;
    return editor.test_data.templates.add(new_tempalte);
  } else {
    editor.test_data.templates.push(new_tempalte);
  }

  return new_group;
}
$(document).ready(function() {
  pull_put.pre_actions.put = function($put_zone, $pulled) {
    if($put_zone.hasClass('__gap')) return;
    var value = editor.edit.change_value();

    var number = $put_zone.parent().children('.generate-item').index($put_zone);
    number+=1;
    var new_position = {
      task: $('.preview .__task').index($put_zone.parents('.__task')),
      number: number
    }

    console.log('PUT:', new_position);
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
});

editor.check.empty = function() {

  var checkers = [{
    type: 'question',
    action: 'prepend',
    position: 'first'
  }]

  $('.preview ' + '.__task').each(function(index, el) {
    var $content = $(this).children('.__content');
    $content.find('.editor__m--empty').remove();

    if($content.children('[type="question"]').length === 0) {
      $content.find('.__catcher').after(editor.check.create_empty('question'));
    }
  });
}


editor.check.create_empty = function(type) {
  var $empty = $("<div class='editor__m--empty' type='empty'></div>");

  $empty.attr('type', 'question');
  $empty.text(editor.check.empty_text);

  pull_put.put_zone.add($empty, function() {
    $empty.after(editor.active_element.build());
    pull_put.reset();
  });

  indicator.add($empty, 'add', 1);

  return $empty;
}

editor.check.numbers = function() {
  $(".preview " + ".__task .__number").each(function(index, el) {
    $(this).text(index + 1);
  });
}

editor.edit.pull_put_actions = {
  edit: {
    icon: loads["Elements/Icons/edit.svg"],
    tip: 'Редактировать',
    _action: function() {
      editor.edit.start();
    }
  },
  preview: {
    icon: loads["Elements/Icons/visibility.svg"],
    tip: 'Показать элемент',
    _action: function() {
      editor.edit.stop();
    }
  }
}

editor.edit.change_value = function() {
  if(pull_put.ui.$.find(".__content").attr('state') === 'edit') {
    var blueprints = editor.active_element.blueprints;
    var parse_value = blueprints.edit.parse(pull_put.ui.$.find(".__content"));

    editor.active_element.value = parse_value;
  } else {
    return editor.active_element.value;
  }

  return parse_value;
}

editor.edit.let = function($element) {
  pull_put.puller.add(
    $element,
    ['add', 'delete', 'save'],
    editor.edit.pull_put_actions.edit,
    function() {
      console.log('showing');
      indicator.show(1);
    },
    false,
    true
  )

  pull_put.put_zone.add(
    $element,
    function(e, $this, $pulled) {
      $this.after(editor.active_element.build());
      pull_put.reset();
    }

  )
  indicator.add($element, 'down', 1);
}

editor.edit.start = function() {
  pull_put.ui.$.find(".__content").attr('state', 'edit');
  indicator.show(1);

  var element_value = editor.active_element.value;
  blueprints = editor.active_element.blueprints;
  var $edit = blueprints.edit.build(element_value);

  pull_put.ui.$.find(".__content")
    .html($edit);

  pull_put.ui.add_action(editor.edit.pull_put_actions.preview);
}

editor.edit.stop = function() {
  var parse_value = editor.edit.change_value();
  pull_put.ui.$.find(".__content").attr('state', 'preview');

  var $element = blueprints.element.build(parse_value);

  pull_put.ui.element = $element;
  pull_put.ui.$.find(".__content").html($element);

  pull_put.ui.add_action(editor.edit.pull_put_actions.edit);
}

editor.active_task = {
  position: undefined,
  value: {}
}

editor.template_ui.hide = function() {
  editor.template_ui.$.addClass('m--hiding');
  setTimeout(function() {
    editor.template_ui.$.addClass('m--hidden');
  }, 500);

}

editor.template_ui.show = function() {
  editor.template_ui.$.removeClass('m--hidden');
  editor.template_ui.$.find('.__templates').html('');

  editor.template_ui.$.removeClass('m--hidden');

  editor.test_data.templates.forEach(function(template) {
    var actions = [
      {
        action: function() {
          var $new_task = generate.data.task.template.add_to_test(template);
          setTimeout(function() {
            $new_task.click();
          }, 500);
        },
        icon: loads['Elements/Icons/add.svg'],
        tip: 'Добавить в тест задание из этого шаблона'
      }, {
      action: function() {
        generate.data.task.template.edit.launch(template);
      },
      icon: loads['Elements/Icons/edit.svg'],
      tip: 'Редактировать шаблон'
    }, {
      action: function() {
        editor.test_data.templates.add(template);
        editor.template_ui.show();
      },
      icon: loads['Elements/Icons/copy.svg'],
      tip: 'Копировать шаблон'
    }]

    var $task = generate.data.task.template
              .build(template.parts, template.variables, template.group);

    //reset actions
    var $actions = $task.find('.__actions');
    $actions.find('button').remove();

    actions.forEach(function(button) {
      var $action = $('<button class="m--ghost m--icon"></button>');
      $action.append(button.icon);
      $action.attr('tip', button.tip);
      $action.click(button.action);
      $actions.append($action);
    });

    button_delete.add($actions, $task, function() {
      //delete
      editor.test_data.templates_remove(template);
      editor.template_ui.show();
    });

    $actions.find('.m--button-delete')
      .removeClass('m--button-delete')
      .attr('tip', 'Удалить шаблон');

    //unbind pull_put shit
    $task.find('.__content').children().each(function() {
      $(this).unbind('click');
    });

    $task.find('.__group').attr('tip', 'Название шаблона');

    editor.template_ui.$.find('.__templates').append($task);
  });

  setTimeout(function() {
    editor.template_ui.$.removeClass('m--hiding');
  }, 10);
}
