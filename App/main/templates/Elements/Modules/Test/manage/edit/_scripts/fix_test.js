test_manager.fix_test_strict = function(test) {
  var fixable = true;

  test = test_manager.fix_test_soft(test);

  if( ! test) {
    return false;
  }

  test.groups = {};

  test.tasks.forEach(function(task) {
    var elements;

    if( ! defined(task.content)) {
      elements = task.parts;
    } else {
      elements = task.content;
    }

    if(elements.length === 0) {
      test_manager.drop('publish');
      return false;
    }

    elements.forEach(function(element) {
      if(element.type === 'answer' && ! ( ! element.never_check
        || element.answer)) {
      if(element.answers.length == 0) {
        test_manager.drop('publish');
        fixable = false;
      }}
    });

    if(task.group) {
      if(test.groups[task.group]) {
        test.groups[task.group]++;
      } else {
        test.groups[task.group] = 1;
      }
    }
  });

  if( ! fixable) {
    return false;
  }

  if(Object.keys(test.groups).length !== 0) {
    test.groups['Другие'] = 0;
    test.tasks.forEach(function(task) {
      if( ! task.group) {
        task.group = "Другие";
        test.groups['Другие']++;
      }
    });
    if(test.groups['Другие'] === 0) delete test.groups['Другие'];
  } else {
      test.groups['Задания'] = test.tasks.length;
  }

  return test;
}

test_manager.fix_test_soft = function(test) {
  test = JSON.parse(JSON.stringify(test));

  if( ! test.title ) {
    console.log('no heading');
    test_manager.drop('save');
    return false;
  }

  if(test.tasks.length === 0) {
    console.log('no empty');
    test_manager.drop('save');
    return false;
  }


  return test;
}
