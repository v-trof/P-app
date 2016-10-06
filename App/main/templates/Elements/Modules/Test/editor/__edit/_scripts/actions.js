editor.edit.pull_put_actions = {
  edit: {
    icon: loads["Elements/Icons/edit.svg"],
    tip: 'Редактировать',
    _action: function() {
      editor.edit.start();
    }
  },
  preview: {
    icon: loads["Elements/Icons/visibility.svg"],
    tip: 'Показать элемент',
    _action: function() {
      editor.edit.stop();
    }
  }
}
