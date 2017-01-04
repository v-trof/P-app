/**
 * Test/generate/core/(s)/core Module for mantaining all test elements
 * @namespace
 */
var generate = {

  /**
   * Data for Element/edit/external creation
   * @type {Object}
   */
  data: {
    task: {},
    question: {},
    answer: {}
  },

  /**
   * counters for id's \\
   * @type {Object}
   */
  counter: {
  }
}

generate.register = {
  bind_data: function(type, subtype, data_type, data_value) {
    var data = generate.data[type][subtype] || {};
    generate.data[type][subtype] = data;
    data.type = type;
    data.subtype = subtype;

    data[data_type] = data_value;

    data[data_type].self = data;

    generate.counter[subtype] = 10;
    return data;
  }
}

generate.register.edit = function(type, subtype, edit_data) {
  if (!(type && subtype)) return false;

  var data = this.bind_data(type, subtype, 'edit', edit_data);

  data.edit.make_template = function(args) {
    return generate.make_template.edit[type](subtype, args);
  }

  //make API constant
  data.edit.build = function(value) {
    editor.active_element.item_id = value.item_id;
    var $edit = $("<div class='m--edit-wrapper'></div>");
    $edit.append(data.edit.builder(value));

    if(type === 'answer') {
      var $worth = render.inputs.text('Макс. балл', 'worth', (value.worth || 1));
      $edit.append($worth);

      if(data.edit.random_possible) {
        var $random = $(loads["Elements/Inputs/checkbox/exports.html"]);
        $random.find('label').text('Случайный порядок');
        $random.find('input').attr('name', "random");
        $random.find('input')[0].checked = value.random;
        $edit.append($random);
      }
    }

    return $edit;
  }
  data.edit.parse = function($edit) {
    var value = data.edit.parser($edit.find('.generate-edit'));
    value.item_id = editor.active_element.item_id;

    if(type === 'answer') {
      value.worth = $edit.find('[name="worth"]').val();
    }

    if(data.edit.random_possible) {
      value.random = $edit.find('[name="random"]')[0].checked;
    }

    value.type = type;
    value.subtype = subtype;

    return value;
  }

  return true;
}

generate.register.element = function element(type, subtype, element_data) {
  if (!(type && subtype)) return false;

  var data = this.bind_data(type, subtype, 'element', element_data);

  //creates proper template build function
  data.element.make_template = function(args) {
    return generate.make_template.element[type](subtype, args);
  }

  //creates build wrapper
  data.element.build = function(value, is_sample) {
    var $element = data.element.builder(value);

    if(is_sample) return $element;

    if(defined(data.edit) &&
       typeof editor !== typeof undefined) {
         editor.edit.let($element);
    }

    if(defined(data.external)) {
      data.external.observe($element);
    }

    return $element;
  }

  //builds sample elemnet
  data.element.sample.build = function() {
    var $sample_element = data.element.build(data.element.sample.value, true);

    return $sample_element;
  }

  data.element.parse = this.element.parser;

  return true;
}

generate.register.external = function(type, subtype, external_data) {
  if (!(type && subtype)) return false;

  var data = this.bind_data(type, subtype, 'external', external_data);

  //creating observe shortcut for summary and send
  data.external.observe = function($element, element_data, _check) {

    if( ! defined(_check)) return false;
    data.external.observer($element, function() {
      var value = data.external.get_value($element);
      var summary = data.external.get_summary(value, element_data);
      _check(value, summary);
    });
  }

  data.external.make_answer = function(user_answer, right_answer,
                                       user_score, worth, result,
                                       element_data) {

    var answers = data.external.to_answer(user_answer, right_answer,
                                          element_data);

    if( ! user_answer) {
      answers.user = $("<b> Пропущено </b>");
    }
    var $new_answer = $(loads.get("Elements/Modules/Test/generate/" +
                                  "data/external/answer/__template/"));
    var $score = $new_answer.find('.__score');

    $new_answer.find('.__user>.__answer').html(answers.user);
    $new_answer.find('.__right>.__answer').html(answers.right);

    $score.find('.__current').html(user_score);
    $score.find('.__max').html(worth);

    summary.set_icon(result, $new_answer.find('.__data>.__icon'));

    setTimeout(function() {
      accordion.add($new_answer.find('.__right'), 'h3');
      var $accordion_toggle = $new_answer.find('.m--accordion-toggle');
      $accordion_toggle.css({
        "left": $accordion_toggle[0].offsetLeft,
        "right": "auto"
      });

      $accordion_toggle.click();
    }, 100);

    return $new_answer;
  }

  data.external.make_answer_edit = function(user_answer, right_answer,
                                       user_score, worth, result) {
    //TODO

  }

  return true;
}

generate.register.task = function(subtype, task_data) {
  var data = this.bind_data('task', subtype, 'element', task_data);
  data.build = task_data.builder;
}

/**
 * Returns general blueprints of this subtype (data[type][subtype])
 * @method get_blueprints
 * @param  {$} element element to parse
 * @return {Object} blueprints
 */
generate.get_blueprints = function(element) {
  //to jq
  var $element = $(element);
  var type = $element.attr('type');
  var subtype = $element.attr('subtype');

  return generate.data[type][subtype];
}

/**
 * Modules/Test/generate/data/__template/(s)/default | Create wrappers for generated elements
 * @type {Object}
 */
generate.make_template = {
  element: {
    question: function(subtype) {
      return $('<div type="question" subtype="' + subtype +
       '" class="generate-item"></div>');
    },
    answer: function(subtype, args) {
      return $('<div type="answer" subtype="' + subtype +
         '" class="generate-item"></div>');
    }
  },
  edit: {
    question: function(subtype) {
      return $('<div type="question" subtype="' + subtype +
       '" class="generate-edit"></div>');
    },
    answer: function(subtype, args) {
      return $('<div type="answer" subtype="' + subtype +
       '"class="generate-edit"></div>');
    }
  }
}

generate.register.task('default', {
  builder: function() {
    var $task = $(loads.get("Elements/Modules/Test/generate/data/task/default/"));

    console.log($task, $task[1]);
    if(defined(generate.data.task.template)) {
      $task.find('.__make-template').click(function() {
        generate.data.task.template.to_tempalte($task);
      });
    } else {
      $task.find('.__make_template').remove();
    }

    return $task;
  }
});

$(document).ready(function() {
  generate.data.task.template.add_to_test = function(template, $edit) {
    template = JSON.parse(JSON.stringify(template));

    if(defined($edit) && editor.template_editor_mode === 'edit') {
      template = generate.data.task.template
      .element.parse_edit(
        $edit.find('.task').children(),
        template);
    }

    var finished = generate.data.task.template.build_finalized_task(template);
    var $new_task = finished.$task;

    console.log('adding to test:', finished.data);

    editor.test_data.add_template(finished.data);

    $('.preview>.__content').append($new_task);

    popup.hide();
    editor.template_ui.hide();
    editor.check.numbers();

    return $new_task;
  }
});

$(document).ready(function() {
  generate.data.task.template
    .build_finalized_task = function(template_data) {
    //unbinding template from editor.active_template
    var unbound_data = template_data;

    //unbinding variables from initial template
    var own_variables= JSON.parse(JSON.stringify(unbound_data.variables));

    unbound_data.variables = own_variables;

    var $new_task = generate.data.task.template.build(
      unbound_data.parts,
      unbound_data.variables,
      unbound_data.group);

      //unbound_data will reference template in original list, not in editor
      $($new_task[1]).click(function(event) {
        if(
          event.target.nodeName.toLowerCase() != "button" &&
          event.target.nodeName.toLowerCase() != "path" &&
          event.target.nodeName.toLowerCase() != "svg"
        ) {
          generate.data.task.template.edit.launch(unbound_data, $new_task);
        }
      });

      button_delete.add($new_task.find('.__overall>.__actions'), $new_task,
      function() {
        var task_pos = $('.preview .__task').index($new_task[1]);
        editor.test_data.delete_task(task_pos);

        setTimeout(editor.check.numbers, 150);
      });

      $new_task.find('.m--button-delete').removeClass('m--button-delete');

      var $gap = $($new_task[0]);
      pull_put.put_zone.add($gap, function() {
        editor.insert_new_task($gap);
        pull_put.reset();
      });
      indicator.add($gap, 'add', 1);

      return {
        data: unbound_data,
        $task: $new_task
      };
    }
});

$(document).ready(function() {
  generate.data.task.template.to_tempalte = function($task) {
    var position = $('.preview .__task').index($task[1]);

    var old_content = editor.test_data.tasks[position].content;

    var new_task_data = {
      group: editor.test_data.tasks[position].group,
      parts: [],
      variables: [],
      is_template: true
    };

    old_content.forEach(function(part) {
      new_task_data.parts.push(part);
      console.log(part);
    });

    var new_task_bundle = generate.data.task.template
                            .build_finalized_task(new_task_data);

    var new_group = editor.test_data.templates.add(new_task_bundle.data);

    new_task_bundle.data.group = new_group;

    editor.test_data.tasks[position] = new_task_bundle.data;

    new_task_bundle.$task.find('input.__group').val(new_group);

    $($task[1]).replaceWith(new_task_bundle.$task);
    $task[0].remove();

    editor.check.numbers();
    editor.check.empty();
  }
});

//making shure to run after register
$(document).ready(function() {
  generate.data.task.template.edit = {
    observe_new_vars: function($edit) {
      $edit.find('.task .__value').keyup(function() {

        var new_variables = [];
        $edit.find('.task .__value').each(function() {
          var used_variables = generate.data.task
                                 .template.edit.check_for_vars($(this));

          used_variables.forEach(function(variable) {
            if(new_variables.indexOf(variable) === -1) {
              new_variables.push(variable);
            }
          });
        });
        generate.data.task.template.edit.update_variables(new_variables, $edit);
      });
    },

    check_for_vars: function($element) {
      var expression = /%\(([^()]+)\)/g;
      var test_string = "";
      var variables = [];

      if($element.val()) {
        test_string = $element.val();
      } else if($element.text()) {
        test_string = $element.text();
      }

      while(result = expression.exec(test_string)) {
        variables.push(result[1]);
      }

      return variables;
    },

    build_variables: function(variables, $edit) {
      var $variables = $edit.find('.__variables');

      if(variables.length === 0) {
        $variables.html('Переменных нет.<br>Они создаются выражением:<br>' +
          '<i>%(название пременной)</i>');
        return;
      }

      $variables.html('');

      variables.forEach(function(variable) {
        function rescan_vars() {
          var variables = [];
          $variables.find('input').each(function() {
            variables.push({
              name: $(this).attr('name'),
              value: $(this).val(),
            })
          });

          return variables;
        }

        var $var_field = render.inputs
                          .text(variable.name, variable.name, variable.value);
        $variables.append($var_field);

        $var_field.keyup(function() {
          editor.active_template.variables = rescan_vars();

          if(editor.template_editor_mode === 'preview') {
            var $new_task = generate.data.task.template.build(
                              editor.active_template.parts,
                              editor.active_template.variables,
                              editor.active_template.group);
            $new_task.find('.__actions button').css('pointer-events', 'none');

            $new_task.find('.__content').children().each(function() {
              $(this).unbind('click');
            });

            $edit.find('.task').html($new_task);

            console.log('preview -> rebuilt', $edit);
          }
        });

      });

    },

    update_variables: function(new_variables, $edit) {
      var compound = [];

      editor.active_template.variables.forEach(function(variable) {
        var index = new_variables.indexOf(variable.name);
        if(index > -1) {
          compound.push(variable);
          new_variables.splice(index, 1);
        }
      });

      new_variables.forEach(function(name) {
        compound.push({
          name: name,
          value: ""
        });
      });

      editor.active_template.variables = compound;
      generate.data.task.template.edit
        .build_variables(compound, $edit);
    },

    build_editor: function(parts, variables) {
      var $edit = $(loads['Elements/Modules/Test/generate/data/' +
                        'task/template/__edit/exports.html']);

      $edit.css('width', "100%");

      return $edit;
    },

    launch: function(template, $instance) {
      editor.active_template = template;
      editor.template_editor_mode = 'edit';

      var $edit = generate.data.task.template.edit
                    .build_editor(template.parts, template.variables)

      $edit.find('.task').html(generate.data.task.template.element
                               .build_edit(template.parts, template.group));
      popup.show($edit, function() {}, {"width": "64rem"}, true);

      generate.data.task.template.edit.observe_new_vars($edit);

      generate.data.task.template.edit.handle_actions($edit, $instance);

      generate.data.task.template.edit
        .build_variables(template.variables, $edit);
    }
  }
});

$(document).ready(function() {
  generate.data.task.template.edit.handle_actions = function($edit, $instance) {
    var $mode_swap = $edit.find('.__mod_swap');
    var $add = $edit.find('.__add');
    var $save = $edit.find('.__save');

    var old_group = editor.active_template.group;

    //template better be unbound for prototypes
    if(! defined($instance)) {
      editor.active_template = JSON.parse(JSON.stringify(editor.active_template));
    }

    $mode_swap.click(function() {
      console.log('was:', editor.template_editor_mode);

      if(editor.template_editor_mode === 'edit') {
        editor.template_editor_mode = 'preview';

        editor.active_template = generate.data.task.template
                                  .element.parse_edit(
                                    $edit.find('.task').children(),
                                    editor.active_template);

        var $new_task = generate.data.task.template.build(
                          editor.active_template.parts,
                          editor.active_template.variables,
                          editor.active_template.group);
        $new_task.find('.__actions button').css('pointer-events', 'none');

        console.log($edit);

        $edit.find('.task').html($new_task);

        $mode_swap.html(loads['Elements/Icons/edit.svg'])
          .attr('tip', 'Редактировать');
      } else {
        editor.template_editor_mode = 'edit';

        $edit.find('.task').html(generate.data.task.template.element
                                 .build_edit(
                                   editor.active_template.parts,
                                   editor.active_template.group));

        generate.data.task.template.edit.observe_new_vars($edit);

        $mode_swap.html(loads['Elements/Icons/visibility.svg'])
          .attr('tip', 'Показать задание');
      }
    });

    if($instance) {
      $add.html(loads['Elements/Icons/copy.svg']);
      $add.attr('tip', 'Создать новое задание (старое сохранится)');
    }

    $add.click(function() {
      generate.data.task.template.add_to_test(editor.active_template, $edit);
    });

    if($instance) {
      $save.click(function() {
        if(editor.template_editor_mode === 'edit') {
          editor.active_template = generate.data.task.template
                                    .element.parse_edit(
                                      $edit.find('.task').children(),
                                      editor.active_template);
        }

        $new_task = generate.data.task.template
                      .build_finalized_task(editor.active_template).$task;

        $($instance[1]).replaceWith($new_task);
        $instance[0].remove();

        $instance = $new_task;

        var position = $('.preview .__task').index($instance[1]);

        editor.test_data.tasks[position] = editor.active_template;
        editor.test_data.tasks[position].is_template = true;

        editor.check.numbers();
      });
    } else {
      $save.click(function() {
        if(editor.template_editor_mode === 'edit') {
          editor.active_template = generate.data.task.template
                                    .element.parse_edit(
                                      $edit.find('.task').children(),
                                      editor.active_template);
        }

        editor.test_data.templates.save(editor.active_template, old_group);
        editor.template_ui.show();

        console.log('rebuilding');

        editor.test_data.tasks.forEach(function(task, index) {
          if(task.is_template) {

            var new_parts = editor.test_data.template_get_parts(task.group);
            if(new_parts) {
              task.parts = new_parts;
            }

            //[0] is gap
            var $new_task = generate.data.task.template
                              .build_finalized_task(task).$task[1];
            console.log('data:', task, 'idx:', index);
            console.log('built:', $new_task);

            $('.preview>.__content>.__task').eq(index).replaceWith($new_task);
          }
      });
        editor.check.numbers();
      });
    }
  }
});

generate.register.task('template', {
  build_edit: function(parts, group) {
    var $task = generate.data.task.default.build();
    var $content = $task.find('.__content');

    parts.forEach(function(part) {
      var $part = generate.data[part.type][part.subtype]
                    .edit.build(part);

      $content.append($part);
    });

    $task.find('.__number').text('Шаблон задания');

    $task.find('.__actions button').remove();

    $task.find('input.__group').val(group).attr('tip', 'Название шаблона');

    return $task;
  },

  parse_edit: function($edit, source) {
    function scan_for_vars() {
      //regexp thing
    }

    var template = {
      parts: [],
      variables: source.variables,
      group: ""
    }

    template.group = $edit.find('.__group').val();

    for(var i=0; i<source.parts.length; i++) {
      var $part_edit = $edit.find('.__content').find('.m--edit-wrapper').eq(i);
      var new_part = generate.data[source.parts[i].type]
                                  [source.parts[i].subtype]
                                  .edit.parse($part_edit);

      template.parts.push(new_part)
    }

    return template;
  },

  builder: function(parts, variables, group) {
    var $task = generate.data.task.default.build();
    var $content = $task.find('.__content');
    var $serialize = $('<button class="m--ghost m--icon __serialize">'
                      + loads['Elements/Icons/serialize.svg']
                      + '</button>');


    //keeping objects safe
    var parts = JSON.parse(JSON.stringify(parts));

    parts.forEach(function(part) {
      part = generate.data.task.template.unwrap_replace(part, variables);
    });

    parts.forEach(function(part) {
      var $part = generate.data[part.type][part.subtype]
                    .element.build(part);
      $part.children('.indicator').remove();
      $content.append($part);
    })

    $serialize.click(function() {
      generate.data.task.template.serialize($task, parts, variables);
    });
    $serialize.attr('tip', 'Превратить это задание в обычное');
    $task.find('.__make-template').replaceWith($serialize);

    if(group) {
      $task.find('input.__group').val(group)
    }
    $task.find('input.__group').attr('disabled', 'disabled');


    $task.find('.__content').children().each(function() {
      $(this).unbind('click').removeClass('m--pullable')
                             .removeClass('m--put-zone');
    });
    $task.addClass('m--template');

    return $task;
  }
});

$(document).ready(function() {
  generate.data.task.template.serialize = function($task, parts, variables) {
    var position = $('.preview .__task').index($task[1]);

    var new_task_data = {
      group: editor.test_data.tasks[position].group,
      content: [],
    };

    parts.forEach(function(part) {
      new_task_data.content.push(generate.data.task.template
                                  .unwrap_replace(part, variables));
    });

    editor.test_data.tasks[position] = new_task_data;

    var $new_task = editor.create_new_task();
    new_task_data.content.forEach(function(part_data) {
      var $element = generate.data[part_data.type][part_data.subtype].
                      element.build(part_data);
      $new_task.find('.__content').append($element);
    });

    $new_task.find('.__group').val(new_task_data.group);


    $($task[1]).replaceWith($new_task);
    $task[0].remove();

    editor.check.numbers();
    editor.check.empty();
  }
});

$(document).ready(function() {
  generate.data.task.template.unwrap_replace = function(obj, variables) {
    if(typeof obj === 'string') {
      variables.forEach(function(variable) {
        obj = obj.replaceAll('%(' + variable.name + ')', variable.value);
      });
    } else if(obj instanceof Array) {
      obj.forEach(function(part) {
          part = generate.data.task.template.unwrap_replace(part, variables);
      });

      for(var i = 0; i < obj.length; i++) {
        obj[i] = generate.data.task.template.unwrap_replace(obj[i], variables);
      }
    } else if(typeof obj === "object") {
      for(key in obj) {
        obj[key] = generate.data.task.template.unwrap_replace(obj[key], variables)
      }
    }

    return obj;
  }
});

generate.register.edit('answer', 'classify', {
  random_possible: true,

  create_item: function(item_text) {
    var $new_item = $(loads.get('Elements/Modules/Test/generate/' +
                                'data/elements/answer/classify/__item/'));

    $new_item.append(render.inputs.text("Текст элемента", '', item_text));
    button_delete.add($new_item);

    return $new_item;
  },

  create_class: function(title, items, special_class) {
    var self = this;
    var $new_class = $(loads.get('Elements/Modules/Test/generate/' +
                                 'data/elements/answer/classify/'));
    var $items = $new_class.find('.__items');
    var $add_btn = $('<button class="m--ghost m--icon"></button>');

    if(items.length > 0) {
      items.forEach(function(item_text) {
        $items.append(self.create_item(item_text));
      });
    }

    $new_class.find('.__title').text(title).attr('contenteditable', 'true');
    $new_class.addClass(special_class);

    button_delete.add($new_class);
    $add_btn.append(loads['Elements/Icons/add.svg']);
    $add_btn.click(function() {
      $add_btn.before(self.create_item(''));
    });
    $new_class.find('.__items').append($add_btn);

    return $new_class;
  },

  builder: function(value) {
    var self = this;
    var items_copy = value.items ? value.items.slice() : [];

    var $new_element = self.make_template(value);
    var $add_btn = $('<button class="m--ghost m--icon"></button>');

    if(value.classes) {
      value.classes.forEach(function(class_name) {
        var class_items = [];

        if(value.answer[class_name]) {
          value.answer[class_name].forEach(function(item) {
            items_copy.remove(item);
            class_items.push(item);
          });
        }

        $new_element.append(self.create_class(class_name, class_items));
      });
    }

    if(items_copy.length > 0) {
      $new_element.append(self.create_class('', items_copy, 'm--unordered'));
    }

    $add_btn.append(loads['Elements/Icons/add.svg']);
    $add_btn.click(function() {
      $add_btn.before(self.create_class('', []));
    });
    $new_element.append($add_btn);

    return $new_element;
  },

  parser: function($edit) {
    var items = [],
        classes = [],
        answer = {};
    var empty  = 1;
    $edit.children('.__class').each(function() {
      var title = $(this).children('h3').text();
      if(title === '') {
        title = 'Тип ' + empty;
        empty++;
      }

      answer[title] = [];
      classes.push(title);

      //loop over items
      $(this).find('input').each(function() {
        if(this.value) {
          answer[title].push(this.value);
          items.push(this.value);
        }
      });
    });

    return {
      items: items,
      classes: classes,
      answer: answer
    }
  }
});

generate.register.edit('answer', 'checkbox', {
  random_possible: true,
  builder: function(value) {
    var $new_edit = this.make_template();

    var create_field = function(label) {
      var $checkbox = $(loads.get('Elements/Inputs/checkbox/'));
      var $input = render.inputs.text('', '', label);

      var $field = $("<div class='__edit_item'></div>");
      $field.append($checkbox).append($input);
      button_delete.add($field);

      return $field;
    }

    if(value.items && value.items.length) {
      value.items.forEach(function(label, index) {
        var $field = create_field(label);

        $new_edit.append($field);
        if(value.answer.has(index)) {
          $field.find('[type="checkbox"]')[0].checked = true;
        }
      });
    } else {
      $new_edit.append(create_field());
    }


    var $add_option = $("<button class='__add_option'>Ещё вариант</button>");

    $new_edit.append($add_option);

    $add_option.click(function() {
      $add_option.before(create_field());
    });

    return $new_edit;
  },

  parser: function($edit) {
    var value = {
      items: [],
      answer: []
    }

    $edit.find(".m--checkbox").each(function(index, el) {
      var label = $(el).siblings().find(".__value").val();

      value.items.push(label);

      if($(el).find("input").is(":checked")) {
        value.answer.push(index);
      }
    });

    return value;
  }
});

generate.register.edit('answer', 'radio', {
  random_possible: true,
  builder: function(value) {
    var $new_edit = this.make_template();
    var group = generate.counter.radio++;

    var create_field = function(label) {
      var $radio = $(loads.get('Elements/Inputs/radio/'));
      var $input = render.inputs.text('', '', label);

      var $field = $("<div class='__edit_item'></div>");

      $radio.find('input').attr('name', "new_radio_" + group);

      $field.append($radio).append($input);
      button_delete.add($field);

      return $field;
    }

    if(value.items && value.items.length) {
      value.items.forEach(function(label, index) {
        var $field = create_field(label);

        $new_edit.append($field);
        if(value.answer.has(index)) {
          $field.find('[type="radio"]')[0].checked = true;
        }
      });
    } else {
      $new_edit.append(create_field());
    }


    var $add_option = $("<button class='__add_option'>Ещё вариант</button>");

    $new_edit.append($add_option);

    $add_option.click(function() {
      $add_option.before(create_field());
    });

    return $new_edit;
  },

  parser: function($edit) {
    var value = {
      items: [],
      answer: []
    }

    $edit.find(".m--radio").each(function(index, el) {
      var label = $(el).siblings().find(".__value").val();

      value.items.push(label);

      if($(el).find("input").is(":checked")) {
        value.answer.push(index);
      }
    });

    return value;
  }
});

generate.register.edit('question', 'file', {
  builder: function(value) {
    var $new_edit = this.make_template();

    var $filename = render.inputs.text('Название файла (как его увидят ученики)',
                                      'file_name', value.name);
    var $file_input = $(loads.get("Elements/Inputs/file/"));

    $new_edit.append($filename);

    $new_edit.append($file_input);
    var file_data = file_catcher.add($file_input);

    if(defined(value.asset_id) || defined(value.url)) {
      $file_input.find('.__text').text(value.file_name);
      file_data.value.change(function() {
        editor.assets.replace(value.asset_id, file_data);
      });
    }

    if( ! defined(value.asset_id)) {
      value.asset_id = editor.assets.add(file_data);
    }

    return $new_edit;
  },

  parser: function($edit) {
    var value = {};
    value.asset_id = editor.active_element.value.asset_id;
    value.name = $edit.find('[name="file_name"]').val();

    if(defined(editor.assets.get(value.asset_id))) {
      value.file_name = editor.assets.get(value.asset_id).name;
      value.size = Math.floor(editor.assets.get(value.asset_id)
                    .files[0].size/1024/1024*100)/100 + "МБ";
    } else {
      value.file_name = editor.active_element.value.file_name;
      value.size = editor.active_element.value.size;
    }

    if(value.name === '') {
      value.name = value.file_name;
    }

    return value;
  }
});

generate.register.edit('answer', 'text', {
  builder: function(value) {
    var $new_edit = this.make_template();

    //for label (tip)
    var $label = render.inputs.text('Формат ответа', 'label', value.label);
    $new_edit.prepend($label);

    //for right answer
    var $answer = render.inputs.text('Верный ответ', 'answer', value.answer);
    $new_edit.prepend($answer);

    return $new_edit;
  },

  parser: function($edit) {
    var value = {
      label: '',
      answer: undefined
    }

    value.label = $edit.find('[name="label"]').val();
    value.answer = $edit.find('[name="answer"]').val();

    return value;
  }
});

generate.register.edit('question', 'image', {
  builder: function(value) {
    var $new_edit = this.make_template();

    var $file_input = $(loads.get("Elements/Inputs/file/"));

    $new_edit.append($file_input);
    var file_data = file_catcher.add($file_input);

    if(defined(value.asset_id) || defined(value.url)) {
      $file_input.find('.__text').text(value.file_name);
      file_data.value.change(function() {
        editor.assets.replace(value.asset_id, file_data);
      });
    }

    if( ! defined(value.asset_id)) {
      value.asset_id = editor.assets.add(file_data);
    }

    return $new_edit;
  },

  parser: function($edit) {
    var value = {};
    value.asset_id = editor.active_element.value.asset_id;

    var event = editor.assets.get(value.asset_id);

    if(defined(event)) {
      value.file_name = editor.assets.get(value.asset_id).name;
      value.href = URL.createObjectURL(event.files[0]);
      value.url = undefined;
    } else {
      value.href = value.url || editor.active_element.value.href;
      value.file_name = editor.active_element.value.file_name;
    }

    return value;
  }
});

generate.register.edit('question', 'text', {
  builder: function(value) {
    var $new_edit = this.make_template();
    $new_edit.prepend(loads.get("Elements/Inputs/text/textarea/"));

    $new_edit.find('label').text('Текст');
    $new_edit.find('.__value').html(value.text);

    if(value.text) {
      $new_edit.find('label').addClass('m--top');
    }

    inline_editor.start($new_edit.find('.__value')[0]);

    return $new_edit;
  },

  parser: function($edit) {
    return {
      text: $edit.find('.__value').html()
    }
  }
});

generate.register.element('question', 'file', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    var $file_template = $(loads.get("Elements/card/file/exports.html"));

    $file_template.attr("href", value.url);
    $file_template.find(".__name").text(value.name);
    $file_template.find(".__size").text(value.size);

    $new_element.append($file_template);

    return $new_element;
  },
  sample: {
    value: {
      name: "Файл для скачивания",
      size: "3.21МБ",
      pos: undefined,
      url: "https://thetomatos.com/wp-content/uploads/2016/05/file-clipart-3.png"
    }
  }
});

generate.register.element('question', 'text', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    $new_element.html('<div class="__value">' + value.text + '</div>');

    return $new_element;
  },
  sample: {
    value: {
      text: 'Текстовый вопрос'
    }
  }
});

generate.register.element('question', 'image', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    var $image = $(document.createElement('img'));

    $image.attr("src", value.url || value.href);
    $image.css('max-width', '100%');
    $new_element.css({
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center'
    });

    $new_element.append($image);

    return $new_element;
  },
  sample: {
    value: {
      url: "/media/samples/image.jpg"
    }
  }
});

generate.register.element('answer', 'checkbox', {
  show_in_items: true,

  builder: function(value) {

    value.answer = value.answer || [];

    var $new_element = this.make_template(value);
    value.items.forEach(function(label, index) {
      var $new_checkbox = $(loads.get('Elements/Inputs/checkbox/'));
      $new_checkbox.find('label').text(label);

      if(value.answer.has(index)) {
        $new_checkbox.find('input')[0].checked = true;
      }

      $new_element.append($new_checkbox);
    });

    return $new_element;
  },

  sample: {
    value: {
      items: ['Вариант 1', 'Вариант 2', 'Вариант 3'],
      answer: [1],
      worth: 1
    }
  }
});

generate.register.element('answer', 'classify', {
  show_in_items: true,

  create_item: function(item_text, indicator_index) {
    var $new_item = $(loads.get('Elements/Modules/Test/generate/' +
                                'data/elements/answer/classify/__item/'));
    $new_item.text(item_text);
    $new_item.addClass('classify_item_'+indicator_index);

    //binding pull_put
    pull_put.puller.add(
      $new_item, //element
      [], //actions
      undefined, //additional
      function() {
        indicator.show(indicator_index);
        pull_put.ui.$.find('.__content').css('min-width', '10rem');
      },
      false,
      true
    );

    return $new_item;
  },

  check: function($element) {
    $element.find('.__items').each(function() {
      if($(this).children('.__item').length === 0) {
        if($(this).children('.m--classify-empty').length === 0) {
          $(this).append('<div class="m--classify-empty">Пусто</div>');
        }
      } else {
        $(this).children('.m--classify-empty').remove();
      }
    });
  },

  create_class: function(title, items, special_class, indicator_index) {
    var self = this;
    var $new_class = $(loads.get('Elements/Modules/Test/generate/' +
                                 'data/elements/answer/classify/'));

    var $items = $new_class.find('.__items');
    if(items.length === 0) {
      $items.append('<div class="m--classify-empty">Пусто</div>');
    } else {
      items.forEach(function(item_text) {
        $items.append(self.create_item(item_text, indicator_index));
      });
    }

    //binding pull_put
    pull_put.put_zone.add($items, function(event, $this, $pulled) {
      if($pulled.hasClass('classify_item_'+indicator_index)) {
        $items.append($pulled);
        console.log($pulled);
        pull_put.reset();
        indicator.hide(indicator_index);
        self.check($new_class.parent());
      }
    });

    indicator.add($items, 'add', indicator_index);

    $new_class.find('.__title').text(title);
    $new_class.addClass(special_class);

    return $new_class;
  },

  builder: function(value) {
    var self = this;
    var indicator_index = generate.counter.classify++;

    var items_copy = value.items.slice();

    var $new_element = self.make_template(value);

    value.classes.forEach(function(class_name) {
      var class_items = [];

      if(value.answer[class_name]) {
        value.answer[class_name].forEach(function(item) {
          items_copy.remove(item);
          class_items.push(item);
        });
      }

      $new_element.append(self.create_class(class_name, class_items, '',
                                            indicator_index));
    });

    if(items_copy.length > 0) {
      $new_element.append(self.create_class('', items_copy, 'm--unordered',
                                            indicator_index));
    }

    return $new_element;
  },

  sample: {
    value: {
      classes:  ["Глаголы", "Существительные"],
      items: ["Дом", "Стол", "Бук"],
      answer: {}
    }
  }
});

generate.register.element('answer', 'text', {
  show_in_items: true,

  builder: function(value) {
    var $new_element = this.make_template(value);
    $new_element.append(render.inputs.text(
      value.label,
      '',
      value.answer
    ));

    return $new_element;
  },

  sample: {
    value: {
      label: 'Текстовый ответ',
      worth: 1
    }
  }
})

generate.register.element('answer', 'radio', {
  show_in_items: true,

  builder: function(value) {
    var group = generate.counter.radio++;
    value.answer = value.answer || [];

    var $new_element = this.make_template(value);
    value.items.forEach(function(label, index) {
      var $new_checkbox = $(loads.get('Elements/Inputs/radio/'));
      $new_checkbox.find('label').text(label);

      if(value.answer.has(index)) {
        $new_checkbox.find('input')[0].checked = true;
      }

      $new_element.append($new_checkbox);
      $new_element.find('input').attr('name', "radio_" + group);
    });

    return $new_element;
  },

  sample: {
    value: {
      items: ['Вариант 1', 'Вариант 2', 'Вариант 3'],
      answer: [1],
      worth: 1
    }
  }
});

generate.register.external('answer', 'checkbox', {
  get_value: function($element) {
    var answers = [];
    $element.find('.m--checkbox').each(function(index, el) {
      if(el.querySelector('input').checked) {
        answers.push(index);
      }
    });
    return answers;
  },

  get_summary: function(value, element_data) {
    var answers = [];
    var big  = false;

    value.forEach(function(pos) {
      var option = element_data.items[pos];

      if(option.length > 20) {
        option = option.substring(0, 17).escape();
        option = option + "&hellip;";
        big = true;
      } else {
        option = option.escape();
      }

      answers.push(option);
    })

    if(big) {
      answers = answers.join('<br>');
    } else {
      answers = answers.join(', ');
    }

    return answers;
  },


  to_answer: function(user_answer, right_answer, element_data) {
    var self = this.self;

    function make_DOM(answer) {
      element_data.answer = answer;

      var $element = self.element.build(element_data);
      $element.find('input').attr('disabled', 'disabled');

      return $element;
    }

    if( ! Array.isArray(user_answer)) {
      user_answer = [];
    }

    return {
      user: make_DOM(user_answer),
      right: make_DOM(right_answer)
    }
  },

  observer: function($element, _change) {
    $element.find('input').change(_change);
  }
});

generate.register.external('answer', 'classify', {
  get_value: function($element) {
    var answer = {};

    $element.children('.__class').each(function() {
      if($(this).hasClass('m--unordered')) return;

      var title = $(this).children('h3').text();
      answer[title] = [];

      //loop over items
      $(this).find('.__item').each(function() {
        answer[title].push($(this).text());
      });
    });

    return answer;
  },

  unwrap_answer: function(value, reduce) {
    var items = [],
        classes = [];

    for(class_name in value) {
      for(var i = 0; i < value[class_name].length; i++) {
        if(value[class_name][i].length > 20 && reduce) {
          value[class_name][i] = value[class_name][i].substring(0, 17).escape();
          value[class_name][i] = value[class_name][i] + "...";
        } else {
          value[class_name][i] = value[class_name][i].escape();
        }
        classes.remove(class_name);
        classes.push(class_name);
        items.push(value[class_name][i]);
      }
    }

    return {
      classes: classes,
      items: items,
      answer: value
    };
  },

  get_summary: function(value, element_data) {
    //build & item_reduce
    value = this.unwrap_answer(value, true);

    if(value.items.length === 0) {
      console.log('empty');
      return "";
    }

    var $summary = this.self.element.build(value);

    $summary.find('*').unbind('click');

    return $summary;
  },


  to_answer: function(user_answer, right_answer, element_data) {
    // build
    var self = this;
    var make_DOM = function(answer) {
      console.log(answer);
      answer = self.unwrap_answer(answer, true);
      var $element = self.self.element.build(answer);

      $element.find('*').unbind('click');

      return $element;
    }

    return {
      user: make_DOM(user_answer),
      right: make_DOM(right_answer)
    }
  },

  observer: function($element, _change) {
    $element.find('.__items').click(function(event) {
      if(pull_put.is_pulled) {
        _change();
      }
    });
  }
});


//TODO fix attempt icon swap

generate.register.external('answer', 'radio', {
  get_value: function($element) {
    var answers = [];
    $element.find('.m--radio').each(function(index, el) {
      if(el.querySelector('input').checked) {
        answers.push(index);
      }
    });
    return answers;
  },

  get_summary: function(value, element_data) {
    var answers = [];
    var big  = false;

    value.forEach(function(pos) {
      var option = element_data.items[pos];

      if(option.length > 20) {
        option = option.substring(0, 17).escape();
        option = option +  "&hellip;";
        big = true;
      } else {
        option = option.escape();
      }

      answers.push(option);
    })

    if(big) {
      answers = answers.join('<br>');
    } else {
      answers = answers.join(', ');
    }

    return answers;
  },


  to_answer: function(user_answer, right_answer, element_data) {
    var self = this.self;

    function make_DOM(answer) {
      element_data.answer = answer;

      var $element = self.element.build(element_data);
      $element.find('input').attr('disabled', 'disabled');

      return $element;
    }

    if( ! Array.isArray(user_answer)) {
      user_answer = [];
    }

    return {
      user: make_DOM(user_answer),
      right: make_DOM(right_answer)
    }
  },

  observer: function($element, _change) {
    $element.find('input').change(_change);
  }
});

generate.register.external('answer', 'text', {
  get_value: function($element) {
    return $element.find('input').val();
  },

  get_summary: function(value) {
    if( ! value) value = "";

    if(value.length > 20) {
      value = value.substring(0, 17).escape();
      value += "&hellip;"
    } else {
      value = value.escape();
    }

    return value;
  },

  to_answer: function(user_answer, right_answer, element_data) {
    var self = this.self;

    function make_DOM(answer) {
      element_data.answer = answer;
      var $element = self.element.build(element_data);
      $element.find('input').attr('disabled', 'disabled');

      return $element;
    }

    return {
      user: make_DOM(user_answer),
      right: make_DOM(right_answer)
    }
  },

  observer: function($element, _change) {
    var timer;
    var typing_interval = 1000;

    $element.keydown(function() {
      clearTimeout(timer);
      timer = setTimeout(function() {
        var value = $element.find('.__value').val();
        _change();
      }, typing_interval);
    });
  }
});
