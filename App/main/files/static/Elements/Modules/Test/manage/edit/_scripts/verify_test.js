test_manager.fix_test = function(test) {
  test = JSON.parse(JSON.stringify(test));

  test.groups = {};
  test.tasks.forEach(function(task) {
    task.content.each(function(element) {
      if(element.type === 'answer' && ! element.answer) return false;
    });

    if(task.content.length === 0) return false;

    if(task.group) {
      if(test.groups[task.group]) {
        test.groups[task.group]++;
      } else {
        test.groups[task.group] = 0;
      }
    }
  });

  if(Object.keys(test.groups).length !== 0) {
    test.tasks.forEach(function(task) {
      if( ! task.group) task.group = "Другие";
    }
  }

  if( ! test.heading ) {
    test.heading = "Безымянный тест";
  }

  return test;
}
