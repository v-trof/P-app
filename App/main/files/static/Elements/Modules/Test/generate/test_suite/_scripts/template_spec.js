describe('Task Tempalte build', function() {
  it('should build empty task', function() {
    var $task = generate.data.task.template.build([], []);

    console.log($task);

    expect($task.find('.__content').children().length).toEqual(0);
  });

  it('should build static task of 1 part', function() {
    var html = "<p>sa</p>";

    var $task = generate.data.task.template.build([{
      subtype: "text",
      text: html,
      type: "question"
    }], []);

    console.log($task);

    expect($task.find('.__content').children().length).toEqual(1);
    expect($task.find('.__content .__value').html()).toEqual(html);
  });

  it('should build static task of multiple parts', function() {
    var html = "<p>sa</p>";

    var $task = generate.data.task.template.build([{
      subtype: "text",
      text: (html + '1'),
      type: "question"
    }, {
      subtype: "text",
      text: (html + '2'),
      type: "question"
    }], []);

    //$('body').append($task);

    expect($task.find('.__content').children().length).toEqual(2);
    expect($task.find('.__content .__value').eq(0).html()).toEqual(html + '1');
    expect($task.find('.__content .__value').eq(1).html()).toEqual(html + '2');
  });

  it('should build dynamic task of 1 part', function() {
    var html = "<p>%(пер)</p>";

    var $task = generate.data.task.template.build([{
      subtype: "text",
      text: html,
      type: "question"
    }], [{
      name: 'пер',
      value: "знач."
    }]);

    console.log($task);

    expect($task.find('.__content').children().length).toEqual(1);
    expect($task.find('.__content .__value').html())
      .toEqual(html.replace('%(пер)', 'знач.'));
  });

  it('should build dynamic task of multiple parts', function() {
    var html = "<p>%(пер)</p>";
    var html2 = "<p>%(eщё пер)</p>";

    var $task = generate.data.task.template.build([{
      subtype: "text",
      text: html,
      type: "question"
    }, {
      subtype: "text",
      text: html2,
      type: "question"
    }], [{
      name: 'пер',
      value: "знач."
    }, {
      name: 'eщё пер',
      value: "значение"
    }]);

    console.log($task);

    expect($task.find('.__content').children().length).toEqual(2);
    expect($task.find('.__content .__value').eq(0).html())
      .toEqual(html.replace('%(пер)', 'знач.'));

    expect($task.find('.__content .__value').eq(1).html())
      .toEqual(html2.replace('%(eщё пер)', 'значение'));
  });
});

describe('Task Tempalte edit', function() {
  it('should generate whole bunch of edit`s', function() {
      var $task = generate.data.task.template.element.build_edit([{
        subtype: "text",
        text: '1',
        type: "question"
      }, {
        subtype: "text",
        text: '2',
        type: "question"
      }], 'sample');

      expect($task.find('.__content').children().length).toEqual(2);
      $('body').append($task);
  });
});
