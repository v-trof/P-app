search.build = {} 

search.build.num_form = function(number, forms) {
  if(number === 0) {
    return forms.many
  }

  if(number%100 - number%10 != 10) {
    if(number%10 === 0) {
      return forms.many
    }
    if(number%10 === 1) {
      return forms.one
    }
    if(number%10 <= 4) {
      return forms.few
    }
  }

  return forms.many
}

search.build.course = function(data) {
  var $new_course = $(search.template.course);
  var form = "";
  var amount = "";
  
  //heading
  $new_course.find('.__heading').text(data.name);
  
  //closed class
  if(data.is_closed) {
    $new_course.addClass('m--closed');
  }

  //amount of tests
  form = search.build.num_form(data.materials_number, {
    one: "материал",
    few: "материала",
    many: "материалов"
  });

  if(data.materials_number > 0) {
    amount = data.materials_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__cointent').append('<b>' + amount + '</b>'
    + form);

  form = search.build.num_form(data.tests_number, {
    one: "тест",
    few: "теста",
    many: "тестов"
  });

  if(data.tests_number > 0) {
    amount = data.tests_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__cointent').append('<b>' + amount + '</b>'
    + form);

  return $new_course;
}

search.build.test = function(data) {
  var $new_course = $(search.template.test);
  var form = "";
  var amount = "";
  
  //heading
  $new_course.find('.__heading').text(data.name);
  
  //closed class
  if(data.is_closed) {
    $new_course.addClass('m--closed');
  }

  //amount of tests
  form = search.build.num_form(data.materials_number, {
    one: "материал",
    few: "материала",
    many: "материалов"
  });

  if(data.materials_number > 0) {
    amount = data.materials_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__cointent').append('<b>' + amount + '</b>'
    + form);

  form = search.build.num_form(data.tests_number, {
    one: "тест",
    few: "теста",
    many: "тестов"
  });

  if(data.tests_number > 0) {
    amount = data.tests_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__cointent').append('<b>' + amount + '</b>'
    + form);

  return $new_course;
}

search.build.material = function(data) {
  var $new_course = $(search.template.material);
  var form = "";
  var amount = "";
  
  //heading
  $new_course.find('.__heading').text(data.name);
  
  //closed class
  if(data.is_closed) {
    $new_course.addClass('m--closed');
  }

  //amount of tests
  form = search.build.num_form(data.materials_number, {
    one: "материал",
    few: "материала",
    many: "материалов"
  });

  if(data.materials_number > 0) {
    amount = data.materials_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__cointent').append('<b>' + amount + '</b>'
    + form);

  form = search.build.num_form(data.tests_number, {
    one: "тест",
    few: "теста",
    many: "тестов"
  });

  if(data.tests_number > 0) {
    amount = data.tests_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__cointent').append('<b>' + amount + '</b>'
    + form);

  return $new_course;
}

search.build.user = function(data) {
  var $new_course = $(search.template.user);
  var form = "";
  var amount = "";
  
  //heading
  $new_course.find('.__heading').text(data.name);
  
  //closed class
  if(data.is_closed) {
    $new_course.addClass('m--closed');
  }

  //amount of tests
  form = search.build.num_form(data.materials_number, {
    one: "материал",
    few: "материала",
    many: "материалов"
  });

  if(data.materials_number > 0) {
    amount = data.materials_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__cointent').append('<b>' + amount + '</b>'
    + form);

  form = search.build.num_form(data.tests_number, {
    one: "тест",
    few: "теста",
    many: "тестов"
  });

  if(data.tests_number > 0) {
    amount = data.tests_number;
  } else {
    amount = "Нет";
  }

  $new_course.find('.__cointent').append('<b>' + amount + '</b>'
    + form);

  return $new_course;
}
