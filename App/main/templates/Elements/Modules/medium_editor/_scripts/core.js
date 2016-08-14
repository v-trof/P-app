var inline_editor = {
  start: function(element) {
    if( ! this.ready) {
      this.queue.push(element);
      return false;
    }
    var editor = new MediumEditor(element, {
      buttonLabels: 'false',
      autoLink: true,
      placeholder: {
        text: '',
        hideOnClick: true
      },
      toolbar: {
        buttons: [
          {
            name: 'bold',
            aria: 'Жирный',
            tagNames: ['b'],
            contentDefault: '<b>Ж</b>',
          },
          {
            name: 'italic',
            aria: 'Курсив',
            tagNames: ['i'],
            contentDefault: '<i>К</i>',
          },
          {
              name: 'h1',
              action: 'append-h4',
              aria: 'Заголовок',
              tagNames: ['h4'],
              contentDefault: '<b>З</b>',
              classList: ['__heading'],
          },
          {
              name: 'orderedlist',
              aria: 'Нумерованный список',
          },
          {
              name: 'anchor',
              aria: 'Добавить ссылку',
          },
        ]
      }
    });

  },
  ready: false,
  queue: [],
  init: function () {
    self = this;
    self.ready = true;
    self.queue.forEach(function(element) {
      self.start(element);
    });
  },
}

$.getScript('//cdn.jsdelivr.net/medium-editor/latest/js/medium-editor.min.js', function() {
  inline_editor.init();
});
