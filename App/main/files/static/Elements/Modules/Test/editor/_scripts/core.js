/**
 * Modules/Test/editor/ | supports test\material editing
 * @namespace
 */
var editor = {
  /**
   * Editor integrity and display related functions
   * @namespace
   */
  check: {

  },
  /**
   * Element editing functinos
   * @namespace
   */
  edit: {

  },
  template_ui: {}
}

$(document).ready(function() {
  editor.template_ui.$ = $(
      loads.get('Elements/Modules/Test/editor/__template_ui/'));
  $('body').append(editor.template_ui.$);

  editor.template_ui.$.find('.m--close').click(function() {
    editor.template_ui.hide();
  })
});
