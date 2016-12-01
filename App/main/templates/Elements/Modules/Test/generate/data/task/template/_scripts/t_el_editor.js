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
