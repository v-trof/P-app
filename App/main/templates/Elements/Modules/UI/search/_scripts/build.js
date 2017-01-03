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
  var $new_course = $(Search._.template.course);
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
  var $new_test = $(Search._.template.test);
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
  var $new_material = $(Search._.template.material);
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
  var $new_user = $(Search._.template.user);
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
