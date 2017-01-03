var share = {
  ajax: {},
  display: {},
  edit: {},
  search: {},
  current_id: ""
}

$(document).ready(function() {
  var request = function(search) {
    //getting types
    var query = search.$.find('.__query').val();
    var search_types = search.types_active;

    var own = search.$.find('.own_only input')[0].checked;
    var open = search.$.find('.open_only input')[0].checked;

    return $.ajax({
        url: '/func/search/',
        type: 'POST',
        data: {
          'search_types': ['shared'],
          'csrfmiddlewaretoken': loads.csrf_token,
          'search_query': query,
          'shared_query': JSON.stringify(search_types),
          'own': own,
          'open': open
        },
    });
  };

  share.search = new Search(
    request,
    ['test', 'material', 'template_collection'],
    ['Тесты', 'Материалы', 'Наборы шаблонов'],
    ['template_collection']
  );


  //adding own \ open only checkbox
  var $flags = $('<div class="card"></div>');
  var $own = $(loads.get('Elements/Inputs/checkbox/'));
  $own.addClass('own_only');
  $own.find('label').text('Только добавленные мной');

  var $open = $(loads.get('Elements/Inputs/checkbox/'));
  $open.addClass('open_only');
  $open.find('label').text('Только с открытым доступом');

  $flags.append($own);
  $flags.append($open);
  share.search.$.find('.__filters').parent().append($flags);


  share.search.$.find('.m--close').click(function(event) {
    share.search.hide();
  });
  //custom card builders
  share.search.build['test'] = function(data) {
    console.log("SHARE RECIVED TEST:", data);
    return $('<b>HERE IS SEARCH TEST CARD');
  }

  share.search.build['material'] = function(data) {
    console.log("SHARE RECIVED MATERIAL:", data);
    return $('<b>HERE IS SEARCH MATERIAL CARD');
  }

  share.search.build['templates'] = function(data) {
    console.log("SHARE RECIVED TEMPLATE:", data);
    return $('<b>HERE IS SEARCH TEMPLATE CARD');
  }

});

share.ajax.edit = function(new_data) {

}


share.ajax.share = function(share_data) {
  console.log('SHOULD HAVE SHARED', share_data);
  var form_data = new FormData();
  form_data.append('course_id',loads.course.id);
  form_data.append('description',share_data.description);
  form_data.append('open',share_data.open);
  //form_data.append('share_query',JSON.stringify(share_data.share_query));
  form_data.append('subject_tags',JSON.stringify(share_data.tags.subject));
  form_data.append('global_tags',JSON.stringify(share_data.tags.main));
  if (share_data.assets.material)
  	form_data.append('material_id',share_data.assets.material);
  else 
  	form_data.append('test_id',share_data.assets.test);
  if (share_data.assets.templates)
  	form_data.append('templates',JSON.stringify(share_data.assets.templates));
  if (share_data.shared_id)
  	form_data.append('shared_id',share_data.shared_id);
  form_data.append('csrfmiddlewaretoken', loads.csrf_token);
  console.log(form_data);
  $.ajax({
    type:"POST",
    url:"/func/share/",
    data: form_data,
    processData: false,
      contentType: false,
     success: function(response) {
      if(response && response["type"]) {
          notification.show(response["type"], response["message"]);
      } else {
        notification.show('success', 'Группы изменены' );
      }
    }
});
}

share.ajax.unshare = function(share_data) {
  //ajax to unshare
}

share.display.hide = function() {

}

share.display.show = function(data) {

}

share.edit.get_defaults = function() {
  return {
    share_id: false,
    open: false,
    description: "",
    tags: {
      main: [],
      subject: []
    },
    assets: {
      test: false,
      material: false,
      template: []
    }
  }
}

share.edit.parse = function($edit) {
  var share_data = share.edit.get_defaults();
  if( ! $edit) {
    console.log("NOTING TO PARSE");
    return share_data;
  }
  var tags_overall = $edit.find('*[name="overall-tags"]').val();
  var tags_subject = $edit.find('*[name="subject-tags"]').val();

  share_data.tags.main = tags_overall.replace(', ', ',').split(',');
  share_data.tags.subject = tags_subject.replace(', ', ',').split(',');
  share_data.description = $edit.find('.__text.__value').html();
  share_data.open = $edit.find('.__open')[0].checked;


  if($edit.find('.share_test input')[0] &&
     $edit.find('.share_test input')[0].checked) {
      share_data.assets.test = django.test.id;
  }

  if($edit.find('.share_templates input')[0] &&
     $edit.find('.share_templates input')[0].checked) {
      share_data.assets.templates = true;
  }

  if($edit.find('.share_material input')[0] &&
     $edit.find('.share_material input')[0].checked) {
      share_data.assets.material = django.material.id;
  }

  //here should be template parsing
  return share_data;
};

(function() {
  function make_create_actions($new_edit) {
    var $actions = $('<div class="row"></div>');
    var $share_btn = $('<button>Добавить в открытую библиотеку</button>');
    $actions.append($share_btn);
    $share_btn.click(function() {
      var data = share.edit.parse($new_edit);
      share.ajax.share(data);
      popup.hide();
    });

    return $actions;
  }

  function make_edit_actions($new_edit) {
    var $actions = $('<div class="row></div>');
    $actions.append('<button>Сохранить изменения</button>');
    $actions.append('<button class="m--ghost">Добавить как новое</button>');
    $actions.append(
      '<button class="m--ghost" class="m--negative"> Удалить </button>');
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
    $specification.append($core);

    if(editor.test_data.templates || share_data.assets.template) {
      var $templates = $(loads.get('Elements/Inputs/checkbox/'));
      $templates.addClass('share_templates');
      $templates.find('label').text('Шаблоны');
      $specification.append($templates);
    }

    return $specification;
  }

  function make_edit(share_data) {
    var $new_edit = $(loads.get(
                      'Elements/Modules/Test/share/__popup_texts/__edit/'));

    var $desc = $new_edit.find('.__text.__value');
    $desc.html(share_data.description);

    check_if_filled($desc);
    inline_editor.start($desc[0]);

    $new_edit.find('.__specification').html(make_specification(share_data));

    $new_edit.find('.__tags>.__overall').append(render.inputs.text(
      'Через запятую, не более 4', 'overall-tags',  share_data.tags.main.join(', ')
    ));

    $new_edit.find('.__tags>.__subject').append(render.inputs.text(
      'Через запятую, не более 4', 'subject-tags', share_data.tags.subject.join(', ')
    ));

    if(share_data.share_id) {
      $new_edit.find('.__actions').append(make_edit_actions($new_edit));
    } else {
      $new_edit.find('.__actions').append(make_create_actions($new_edit));
    }

    return $new_edit;
  }

  share.edit.show = function(share_data) {
    if( ! share_data) share_data = share.edit.get_defaults();

    var $new_edit = make_edit(share_data);

    popup.show($new_edit);
  }

}() );
