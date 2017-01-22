(function() {
  function make_create_actions($new_edit) {
    var $actions = $('<div class="row"></div>');
    var $share_btn = $('<button>Добавить в открытую библиотеку</button>');
    $actions.append($share_btn);
    $share_btn.click(function() {
      var data = share.edit.parse($new_edit);

      if(data) {
        test_manager.save(function() {
          share.ajax.share(data);
        });
      }
    });

    return $actions;
  }

  function make_edit_actions($new_edit, old_data) {
    var $save = $('<button>Сохранить изменения</button>');
    var $save_as = $('<button class="m--ghost">Сохранить отдельной версией</button>');
    var $unshare = $(
              '<button class="m--ghost m--negative">Удалить</button>');
    var $actions = $('<div class="row"></div>');
    $actions.append($save);
    $actions.append($save_as);
    $actions.append($unshare);

    $save.click(function()    {share.edit.funcs.save($new_edit, old_data);});
    $save_as.click(function() {share.edit.funcs.save_as($new_edit);});
    $unshare.click(function() {share.edit.funcs.unshare(old_data.shared_id);});

    console.log('MADE:', $actions);
    return $actions;
  }

  function make_specification(share_data) {
    // var used = [];
    // function make_tempalte_checker(template_list) {
    //   var $list = $('<div></div>');
    //   var $item;
    //
    //   for(var i = 0;i < template_list.length; i++) {
    //     if(used.has(template_list[i].group)) continue;
    //     used.push(template_list[i].group);
    //
    //     $item = $(loads.get('Elements/Inputs/checkbox/'));
    //     $item.find('label').html(template_list[i].group);
    //     $list.append($item);
    //   }
    //
    //   return $list;
    // }

    var $specification = $('<div></div>');

    var $core = $(loads.get('Elements/Inputs/checkbox/'));
    if(django.current_type === 'test') {
      $core.find('label').html('Тест');
      $core.addClass('share_test');
    } else {
      $core.find('label').html('Материал');
      $core.addClass('share_material');
    }
    $core.find('input')[0].checked = (share_data.type === 'test' ||
                                      share_data.type === 'material');
    $specification.append($core);

    if(editor.test_data.templates || share_data.assets.template) {
      var $templates = $(loads.get('Elements/Inputs/checkbox/'));
      $templates.addClass('share_templates');
      $templates.find('label').text('Шаблоны');
      $specification.append($templates);
      $templates.find('input')[0].checked = share_data.templates_number;
    }

    return $specification;
  }

  function make_edit(share_data) {
    var $new_edit = $(loads.get(
                      'Elements/Modules/Test/share/__popup_texts/__edit/'));

    var $desc = $new_edit.find('.__text.__value');
    var $actions = $new_edit.find('.__actions');
    $desc.html(share_data.description);

    check_if_filled($desc);
    inline_editor.start($desc[0]);

    $new_edit.find('.__specification').html(make_specification(share_data));

    $new_edit.find('.__tags>.__overall').append(render.inputs.text(
      'Через запятую, не более 4',
      'overall-tags',  share_data.global_tags.join(', ')
    ));

    $new_edit.find('.__tags>.__subject').append(render.inputs.text(
      'Через запятую, не более 4',
      'subject-tags', share_data.subject_tags.join(', ')
    ));

    if(share_data.id) {
      $actions.append(make_edit_actions($new_edit, share_data));

      if( ! share_data.is_django) {
        $actions.append(share.display.make_actions(share_data));
      }
    } else {
      $actions.append(make_create_actions($new_edit));
    }

    if( ! share_data.open ) {
      $new_edit.find('.__open')[0].checked = true;
    }

    return $new_edit;
  }

  share.edit.show = function(share_data) {
    if( ! share_data) {
      if(django.share_data) {
        share_data = django.share_data;
          django.share_data.is_django = true;
      } else {
        share_data = share.edit.get_defaults();
      }
    };

    var $new_edit = make_edit(share_data);

    popup.show($new_edit);
  }

}() );
