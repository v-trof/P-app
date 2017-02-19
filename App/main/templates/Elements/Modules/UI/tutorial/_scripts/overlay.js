tutorial.overlay = {
  $: '<div class="tutorial-overlay m--hidden m--hiding"></div>'
}

tutorial.overlay.add = function($element) {
  $element.append(tutorial.overlay.$);

}


tutorial.overlay.show = function($element) {
  if($element.find('.tutorial-overlay').length == 0) {
    tutorial.overlay.add($element);
  }
  $element.find('.tutorial-overlay')
    .removeClass('m--hidden')
    .removeClass('m--is-hiding')
    .removeClass('m--hiding');
}

tutorial.overlay.hide = function($element) {
  var $overlay = $element.find('.tutorial-overlay');

  $overlay.find('.tutorial-overlay')
    .addClass('m--hiding')
    .addClass('m--is-hiding');
  setTimeout(function() {
    if($overlay.hasClass('m--is-hiding')) $overlay.addClass('m--hidden');
  }, 300);
}
