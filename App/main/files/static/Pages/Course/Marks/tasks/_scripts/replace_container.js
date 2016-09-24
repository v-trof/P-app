$(document).ready(function() {
  // console.log('yep');
  $('.m--assignment').each(function(index, el) {
    // console.log('rep');
    $(this).parent().replaceTag('a');
    $(this).find('input').attr('disabled', true);
  });
});
