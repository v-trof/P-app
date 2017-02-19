var tutorial = {}

tutorial.highlight = {}

tutorial.highlight.start = function($element) {
  tutorial.overlay.show($element.parent());
  $element.addClass('tutorial-highlight');
}

tutorial.highlight.end = function($element) {
  tutorial.overlay.show($element.parent());
  $element.addClass('tutorial-highlight');
}

tutorial.modal = {
  $: $('<div class="tutorial-modal m--hiding m--hidden"')
}

tutorial.modal.show = function(html) {
  tutorial.modal.$.html(html);
  tutorial.modal.$
    .removeClass('m--hidden')
    .removeClass('m--hiding')
    .removeClass('m--is-hiding');
}

tutorial.modal.hide = function(html) {
  tutorial.modal.$
    .addClass('m--hiding')
    .addClass('m--is-hiding');

  setTimeout(function() {
    if(tutorial.modal.$.hasClass('m--is-hiding')) {
      tutorial.modal.$.addClass('m--hidden');
    }
  }, 300);
}

$(document).ready(function() {
  $('body').append(tutorial.modal.$);
})

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

tutorial.current = {
  scenario: [],
  position: 0
}

/**
 * scenario item must be
 * highlight = [ {jQuery} ] to highlight
 * modal = {string}
 * hook = {function (callback)} event listener for next action
 * unbind = {function} hook unbinder
 * run = {function} any js you like
 * continue_btn = {bool} display button to continue
 */

tutorial.start = function(scenario) {
  tutorial.current.position = 0;
  tutorial.scenario = scenario;
}

tutorial.prepare_for_next() {
  var position = tutorial.current.position;
  var scenario = tutorial.current.scenario;
  var $parent = scenario[position].highlight.parent().eq(0);
  if (position > 0) {
    tutorial.modal.hide();
    if(scenario[position - 1].unbind) scenario[position - 1].unbind();

    if (scenario[position - 1].highlight != scenario[position].highlight) {
      tutorial.highlight.end(scenario[position - 1].highlight);
    }

    if ($parent != scenario[position - 1].highlight.parent().eq(0)) {
      tutorial.overlay.hide(scenario[position - 1].highlight.parent().eq(0));
    }
  }
  tutorial.modal.hide(scenario[position].modal);

  tutorial.overlay.show($parent);
  tutorial.highlight.start(scenario[position].highlight);
  tutorial.modal.show(scenario[position].modal);

  if(scenario[position].run) scenario[position].run();

  if(scenario[position].hook) {
    scenario[position].hook(tutorial.prepare_for_next);
  }

  if(scenario[position].continue_btn) tutorial.modal.add_continue_btn();
}
