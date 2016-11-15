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
