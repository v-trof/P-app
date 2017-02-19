var tutorial = {}

tutorial.highlight = {}

tutorial.highlight.start = function($element) {
  tutorial.overlay.show($element.parent());
  $element.addClass('tutorial-highlight');
}

tutorial.highlight.hide = function($element) {
  $element.removeClass('tutorial-highlight');
}

tutorial.modal = {
  $: $('<div class="tutorial-modal m--hiding m--hidden"></div>')
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

tutorial.modal.add_continue_btn = function() {
  tutorial.modal.$.find('.tutorial-skip').text('Далее');
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
 * overlay = [ {jQuery} ] to darken
 * modal = {string}
 * bind = {function (callback)} event listener for next action
 * unbind = {function} hook unbinder
 * run = {function} any js you like
 * continue_btn = {bool} display button to continue
 * keep = [ {string} ] things to keep form previous iteration
 */

tutorial.start = function(scenario) {
  tutorial.current.position = 0;
  tutorial.scenario = scenario;
  tutorial.prepare_for_next();
}

//clearly a redo
tutorial.prepare_for_next = function() {
  var position = tutorial.current.position;
  var scenario = tutorial.current.scenario;

  //cleaning up
  if (position > 0) tutorial.undo_last();

  if(position == scenario.length) return;

  //real action
  if(scenario[position].overlay) {
    tutorial.overlay.show(scenario[position].overlay);
  }

  if(scenario[position].highlight) {
    tutorial.highlight.start(scenario[position].highlight);
  }

  if(scenario[position].modal) {
    tutorial.modal.show(scenario[position].modal);
  }

  if(scenario[position].run) {
    scenario[position].run();
  }

  if(scenario[position].bind) {
    scenario[position].bind(tutorial.prepare_for_next);
  }

  if(scenario[position].continue_btn) {
    tutorial.modal.add_continue_btn();
  }
}

tutorial.undo_last = function() {
  var current = tutorial.current.position;
  var position = current - 1;
  var scenario = tutorial.current.scenario;

  ['overlay', 'highlight'].forEach(function(effect) {
    //describes active phase
    var preserve = scenario[current].keep.has(item);

    //remval flags this = next each iteration
    var remove_next = ! preserve;
    var remove_this = false;

    for(; position >= 0; position--) {
      remove_this = remove_next;

      if( ! preserve && ! remove_this) break;

      if(remove_this) {
        preserve = false;
        if(scenario[position][effect]) {
          tutorial[effect].hide(scenario[position][effect]);
        }

        if(scenario[position].keep) {
          remove_next = scenario[position].keep.has(effect);
        }
      } else {
        preserve = (preserve && scenario[position].keep
                    && scenario[position].keep.has(effect));
        remove_next = ! preserve;
      }
    }
  });
}
