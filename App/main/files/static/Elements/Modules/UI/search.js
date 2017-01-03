var Search = function(requester,
  types, types_names, types_active,
  ui,
  templates, builders) {
  var ui = ui || "Elements/Modules/UI/search/exports.html";

  //building
  this.$ = $(loads[ui]);

  this.url = window.location.pathname;
  this.is_shown = false;

  this.show = function() {
      this.$.removeClass('m--hidden');
      this.$.find('input').focus();
      this.is_shown = true;
  }
  this.hide = function() {
      this.$.addClass('m--hidden');
      this.is_shown = false;
  }

  this.types = types;
  this.types_active = types_active;
  var self = this;
  this.request = function() {
    requester(this)
      .success(function(data) {
        self.fill(data);
      })
      .fail(function() {
        notification.show('error', 'Не удалось подключиться к поиску')
      });
  }

  this.fill = function(data) {
    Search._.fill(this, data);
  }

  this.filter = function() {
    Search._.filter(this);
  }

  //adding templates
  this.templates = Search._.templates;
  for(var key in templates) {
    this.templates[key] = templates[key];
  }

  //enabling builders
  this.build = Search._.build;
  for(var key in builders) {
    this.build[key] = builders[key];
  }

  //building filters
  for(var i = 0; i < types.length; i++) {
    var $new_checkbox = $(loads.get('Elements/Inputs/checkbox/'));
    $new_checkbox.find('input').addClass('filter-'+types[i]);
    $new_checkbox.find('label').text(types_names[i]);

    this.$.find('.__filters').append($new_checkbox);
  }

  //enabling UI in DOM
  $('body').append(this.$);

  Search._.enable_query_listener(this);
  Search._.enable_checkbox_listener(this);
}

Search._ = {};

Search._.template = {
  course:   loads.get("Elements/card/course/exports.html"),
  test:     loads.get("Elements/card/test/extended/exports.html"),
  material: loads.get("Elements/card/material/extended/exports.html"),
  user:     loads.get("Elements/card/user/extended/exports.html"),
}

Search._.build = {}

Search._.build.num_form = function(number, forms) {
  if (number === 0) {
    return forms.many
  }

  if (number % 100 - number % 10 != 10) {
    if (number % 10 === 0) {
      return forms.many
    }
    if (number % 10 === 1) {
      return forms.one
    }
    if (number % 10 <= 4) {
      return forms.few
    }
  }

  return forms.many
}

Search._.build.course = function(data) {
  var $new_course = $(search.template.course);
  var form = "";
  var amount = "";

  //heading
  $new_course.find('.__heading').text(data.name);
  $new_course.find('.__content').html("");
  //closed class
  if (data.is_closed) {
    $new_course.addClass('m--closed');
  }

  //amount of tests
  form = search.build.num_form(data.materials_number, {
    one: "материал",
    few: "материала",
    many: "материалов"
  });

  if (data.materials_number > 0) {
    amount = data.materials_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__content').append('<b>' + amount + '</b> ' +
    form + "<br>");

  form = search.build.num_form(data.tests_number, {
    one: "тест",
    few: "теста",
    many: "тестов"
  });

  if (data.tests_number > 0) {
    amount = data.tests_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__content').append('<b>' + amount + '</b> ' +
    form);

  return $new_course;
}

Search._.build.test = function(data) {
  var $new_test = $(search.template.test);
  var form = "";
  var amount = "";

  //heading
  $new_test.find('.__heading').text(data.title);

  //amount of tasks
  $new_test.find('.__content').html("");
  form = search.build.num_form(data.questions_number, {
    one: "вопрос",
    few: "вопроса",
    many: "вопросов"
  });

  if (data.questions_number > 0) {
    amount = data.questions_number;
  } else {
    amount = "Нет";
  }

  $new_test.find('.__content').append('Тест, <b>' + amount + '</b> ' +
    form);

  $new_test.find('.__content').append(
    '<div class="m--grey">Из курса ' +
    data.course_name + '</div>');

  return $new_test;
}

Search._.build.material = function(data) {
  var $new_material = $(search.template.material);
  var form = "";
  var amount = "";

  //heading
  $new_material.find('.__heading').text(data.title);
  $new_material.find('.__content').append(
    '<div class="m--grey">Из курса ' +
    data.course_name + '</div>');

  return $new_material;
}

Search._.build.user = function(data) {
  var $new_user = $(search.template.user);
  var form = "";
  var amount = "";

  //name
  $new_user.find('.__name').text(data.name);

  //state
  if (data.is_teacher) {
    $new_user.find('.__state').text("Преподаватель");
  } else {
    $new_user.find('.__state').text("Ученик");
  }

  //avatar
  $new_user.find('.__user-avatar').attr('src', data.avatar);

  return $new_user;
}

Search._.fill = function(search, data) {
  var $links = search.$.find('.__links')
  $links.html('');

  if (data.length) {
    data.forEach(function(item) {
      var $new_link = $('<a class="m--card m--' +
        item.type + '" href="' +
        item.content.link + '"></a>');
      $new_item = search.build[item.type](item.content);
      $new_link.append($new_item);
      $links.append($new_link);
    });
    search.filter();
  } else {
    $links.append('<div class="m--empty m--grey">Ничего не найдено</div>');
  }


}

Search._.filter = function(search) {
  search.types.forEach(function(type) {
    if (search.types_active.indexOf(type) === -1) {
      search.$.find('.__links').children('.m--' + type).hide();
    } else {
      search.$.find('.__links').children('.m--' + type).show();
    }
  });
}

var search;

(function() {
  var request = function(search) {
    var query = search.$.find('.__query').val();
    //constructing types
    var search_types = {}

    if (search.types_active.indexOf("course") !== -1) {
      search_types.courses = {}
    }

    if (search.types_active.indexOf("user") !== -1) {
      if (search.course_id) {
        search_types.users = {
          course_id: search.course_id
        }
      } else {
        search_types.users = {}
      }
    }

    var add_tasks = (search.types_active.indexOf("test") !== -1);
    var add_material = (search.types_active.indexOf("material") !== -1);

    if (add_tasks && add_material) {
      search_types.elements = {}
    } else if (add_tasks) {
      search_types.elements = {
        type: "test"
      }
    } else if (add_material) {
      search_types.elements = {
        type: "material"
      }
    }

    if (search.course_id && search_types.elements) {
      search_types.elements.course_id = search.course_id;
    }
    return $.ajax({
        url: '/func/search/',
        type: 'POST',
        data: {
          'csrfmiddlewaretoken': loads.csrf_token,
          'search_query': query,
          'search_types': JSON.stringify(search_types)
        },
    });

  }

  $(document).ready(function() {
    search = new Search(
      request,
      ['test', 'material', 'user', 'course'],
      ["Тесты", "Материалы", 'Люди', "Открытые курсы"],
      ['test', 'material']
    );

    $('.header>.__search>button').click(function() {
      if (!search.is_shown) {
        search.show();
      } else {
        search.hide();
      }
    });

    search.$.find('.m--close').click(function(event) {
      search.hide();
    });

    if (search.url.indexOf('course') > -1) {
      exports.course_id = '{{course.id}}';
    }
  });
} ());

Search._.enable_query_listener = function(search) {
  var timer;
  var typing_interval = 500;

  var $input = search.$.find('.__query');

  $input.keydown(function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      var value = $input.val();
      search.request();
    }, typing_interval);
  });
}


Search._.enable_checkbox_listener = function(search) {
  search.$.find('input[type="checkbox"]').each(function(index, el) {
    var type = $(this).attr('class').slice(7);
    if (search.types_active.indexOf(type) > -1) {
      this.checked = true;
    }
    $(this).change(function() {
      if (this.checked) {
        search.types_active.push(type);
        search.request();
      } else {
        search.types_active.remove(type);
        search.filter();
      }
    });
  });
}
