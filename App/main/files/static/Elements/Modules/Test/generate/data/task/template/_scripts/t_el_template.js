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
    function unwrap_replace(obj, variables) {
      if(typeof obj === 'string') {
        variables.forEach(function(variable) {
          obj = obj.replaceAll('%(' + variable.name + ')', variable.value);
        });
      } else if(obj instanceof Array) {
        obj.forEach(function(part) {
            part = unwrap_replace(part, variables);
        });

        for(var i = 0; i < obj.length; i++) {
          obj[i] = unwrap_replace(obj[i], variables);
        }
      } else if(typeof obj === "object") {
        for(key in obj) {
          obj[key] = unwrap_replace(obj[key], variables)
        }
      }

      return obj;
    }

    var $task = generate.data.task.default.build();
    var $content = $task.find('.__content');
    var $serialize = $('<button class="m--ghost m--icon __serialize">'
                      + loads['Elements/Icons/serialize.svg']
                      + '</button>');


    //keeping objects safe
    var parts = JSON.parse(JSON.stringify(parts));

    parts.forEach(function(part) {
      part = unwrap_replace(part, variables);
    });

    parts.forEach(function(part) {
      var $part = generate.data[part.type][part.subtype]
                    .element.build(part);
      $part.children('.indicator').remove();
      $content.append($part);
    })

    $serialize.click(function() {
      generate.data.task.template.serialize($task, parts);
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

  editor.test_data.templates.push({
    parts: [{
      subtype: "text",
      text: '%(fas)',
      type: "question"
    }],
    variables: [{
      name: 'fas',
      value: 'ANISYIA'
    }],
    group: 'not'
  });
});
