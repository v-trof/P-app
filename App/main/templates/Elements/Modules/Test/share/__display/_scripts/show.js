share.display.show = function(data, $item) {
  var $popup = $(loads.get("Elements/Modules/Test/share/__popup_texts/__info/"));
  $popup.find('.__item').append($item.clone());
  $popup.find('.__neutral').remove();

  console.log(data, data.open);
  var subject;

  $popup.find('.__text').html(
    '<p> Предмет: ' + data.subject + '</p>'
    + data.description);

  $popup.find('.__actions').append(share.display.make_actions(data));
  popup.show($popup, function() {}, {'width': '60rem'});
}

share.display.funcs = {}
share.display.make_actions = function(data) {
  var $actions = $('<div class="row"></div>');

  if( ! data.open) {
    var $request_btn = $('<button> Запросить доступ </button>');
    $request_btn.click(function() {
        share.display.funcs.request(data);
      });
    $actions.append($request_btn);
  } else {
    if(data.type === 'templates') {
      var $import_btn = $('<button> Импортировать шаблоны </button>');
      $import_btn.click(function() {
        share.display.funcs.import(data);
      });
      $actions.append($import_btn);
    } else {
      var $append_btn = $('<button> Добавить в конец </button>');
      var $replace_btn = $('<button class="m--ghost">'
      + 'Добавить, заменив текущий </button>');
      $actions.append($append_btn);
      $append_btn.click(function() {
        share.display.funcs.append(data);
      });
      $actions.append($replace_btn);
      $replace_btn.click(function() {
        share.display.funcs.replace(data);
      });
    }
  }

  return $actions;
}

share.display.funcs.import = function(data) {
  $.ajax({
      url: '/func/get_shared/',
      type: 'POST',
      data: {
        'csrfmiddlewaretoken': loads.csrf_token,
        'shared_id': data.shared_id
      }
    }).success(function(responce) {
      console.log('imported', responce);
      responce.tasks = [];
      test_manager.load(responce);
      notification.show('success', 'Шаблоны импортированны');
      popup.hide();
    }).error(function() {
      notification.show('error', 'Ошибка');
    })
}
share.display.funcs.append = function(data) {
  $.ajax({
      url: '/func/get_shared/',
      type: 'POST',
      data: {
        'csrfmiddlewaretoken': loads.csrf_token,
        'shared_id': data.shared_id
      }
  }).success(function(responce) {
    test_manager.load(responce);
    notification.show('success', 'Добавлено');
    popup.hide();
  }).error(function() {
    notification.show('error', 'Ошибка');
  });
}
share.display.funcs.replace = function(data) {
  $.ajax({
      url: '/func/get_shared/',
      type: 'POST',
      data: {
        'csrfmiddlewaretoken': loads.csrf_token,
        'shared_id': data.shared_id
      }
  }).success(function(responce) {
    editor.test_data.tasks = [];
    editor.test_data.title = '';
    $('.preview h2').html('');
    $('.preview .__content').html('');
    test_manager.load(responce);
    notification.show('success', 'Заменено');
    popup.hide();
  }).error(function() {
    notification.show('success', 'Ошибка');
  });
}
share.display.funcs.request = function(data) {
  $.ajax({
      url: '/func/get_shared/',
      type: 'POST',
      data: {
        'csrfmiddlewaretoken': loads.csrf_token,
        'shared_id': data.shared_id,
        'course_id': django.course.id
      }
  }).success(function(responce) {
    notification.show('success', 'Заявка на копирование отправлена ');
    popup.hide();
  }).error(function() {
    notification.show('error', 'Ошибка');
  });
}
