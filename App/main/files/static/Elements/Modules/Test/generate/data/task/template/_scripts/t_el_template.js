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

      console.log($part_edit);

      var new_part = generate.data[source.parts[i].type]
                                  [source.parts[i].subtype]
                                  .edit.parse($part_edit);

      console.log(new_part);

      template.parts.push(new_part)
    }

    return template;
  },

  add_to_test: function(parts, variables) {
    return $task;
  },

  builder: function(parts, variables, group) {
    function unwrap_replace(obj, variables) {
      if(typeof obj === 'string') {
        variables.forEach(function(variable) {
          obj = obj.replace('%(' + variable.name + ')', variable.value);
        });
      } else if(obj instanceof Array) {
        obj.forEach(function(part) {
            part = unwrap_replace(part, variables);
        });
      } else if(typeof obj === "object") {
        for(key in obj) {
          obj[key] = unwrap_replace(obj[key], variables)
        }
      }

      return obj;
    }

    var $task = generate.data.task.default.build();
    var $content = $task.find('.__content');

    //keeping objects safe
    var parts = JSON.parse(JSON.stringify(parts));

    parts.forEach(function(part) {
      part = unwrap_replace(part, variables);
    });

    parts.forEach(function(part) {
      var $part = generate.data[part.type][part.subtype]
                    .element.build(part);

      $content.append($part);
    })

    if(group) {
      $task.find('input.__group').val(group);
    }

    return $task;
  }
});

$(document).ready(function() {
  editor.test_data.templates.push({
    parts: [{
      subtype: "text",
      text: '%(eщё пер)',
      type: "question"
    }, {
      subtype: "text",
      text: '%(пер)',
      type: "question"
    }],
    variables: [{
      name: 'пер',
      value: "знач."
    }, {
      name: 'eщё пер',
      value: "значение"
    }],
    group: 'sample'
  });
});
