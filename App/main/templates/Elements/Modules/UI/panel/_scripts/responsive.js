;(function () {
  var $btn =
    $('<button class="panel_mobile_open m--hidden m--flat"> &laquo; </button>');
  var needed = false;
  var last_scroll = -1;
  $('body').append($btn);


  function check_need() {
    needed = panel.used;
    if(needed) {
      if(panel.shown) {
        $btn.removeClass('m--hidden');
        $btn.addClass('m--alt');
        return;
      } else {
        $btn.removeClass('m--alt');
      }

       if(last_scroll < 3) {
        $btn.removeClass('m--hidden');
        last_scroll++;
        return;
      }
    }
    $btn.addClass('m--hidden');
  }
  setInterval(check_need, 1000);

  $("body, .preview, .main").scroll(function() {
    last_scroll = -1;
    check_need();
  });

  $(document).scroll(function() {
    last_scroll = -1;
    check_need();
  });

  $(document).click(function() {
    //click on very major free space
    if($(this).is('.main') || $(this).is('.preview')
        ||  $(this).is('body')   || $(this).is(document)) {
      last_scroll = -1;
      check_need();
    }
  });

  $btn.click(function () {
    if(panel.shown) {
      panel.hide();
    } else {
      panel.show();
    }
    check_need();
  });
}() );
