$(document).ready(function() {
  var today = new Date();

  $('.__due-date input').pickmeup({
    format: 'd-m-Y',
    min: today
  }).click(function() {
    var rect = $('.pickmeup')[0].getBoundingClientRect();
    console.log(rect);
    if(rect.left + rect.width > window.innerWidth
    || rect.top + rect.height > window.innerHeight) {
      $('.pickmeup')
        .removeAttr('style')
        .css({
          'top': (window.innerHeight - rect.height)/2 + 'px',
          'border': '1px solid #f5f5f5'
        })
        .show();
    }
  });

});
