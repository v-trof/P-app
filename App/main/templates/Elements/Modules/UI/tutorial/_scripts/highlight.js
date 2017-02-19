tutorial.highlight = {}

tutorial.highlight.start = function($element) {
  tutorial.overlay.show($element.parent());
  $element.addClass('tutorial-highlight');
}

tutorial.highlight.hide = function($element) {
  $element.removeClass('tutorial-highlight');
}
