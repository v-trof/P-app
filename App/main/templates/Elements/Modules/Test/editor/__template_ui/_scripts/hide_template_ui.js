editor.template_ui.hide = function() {
  editor.template_ui.$.addClass('m--hiding');
  setTimeout(function() {
    editor.template_ui.$.addClass('m--hidden');
  }, 500);

}
