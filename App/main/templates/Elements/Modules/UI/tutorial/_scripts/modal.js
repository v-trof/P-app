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
