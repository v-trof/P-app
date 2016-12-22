var inline_editor = {
  start: function(element) {
    if (!this.ready) {
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
        buttons: [{
          name: 'bold',
          aria: 'Жирный',
          tagNames: ['b'],
          contentDefault: '<b>Ж</b>',
        }, {
          name: 'italic',
          aria: 'Курсив',
          tagNames: ['i'],
          contentDefault: '<i>К</i>',
        }, {
          name: 'h1',
          action: 'append-h4',
          aria: 'Заголовок',
          tagNames: ['h4'],
          contentDefault: '<b>З</b>',
          classList: ['__heading'],
        }, {
          name: 'orderedlist',
          aria: 'Нумерованный список',
        }, {
          name: 'quote',
          aria: 'Выделить абзац '
        }, {
          name: 'anchor',
          aria: 'Добавить ссылку',
        }, ]
      },
      anchor: {
        placeholderText: 'Впишите или вставьте ссылку',
      }
    });

    function handlePaste(e) {
      console.log('paste', e);
      e.preventDefault();
      var text = e.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    }

    element.addEventListener('paste', handlePaste);


  },
  ready: false,
  queue: [],
  init: function() {
    self = this;
    self.ready = true;
    self.queue.forEach(function(element) {
      self.start(element);
    });
  },
}

$.getScript('/static/scripts/medium-editor.js', function() {
  inline_editor.init();
});
