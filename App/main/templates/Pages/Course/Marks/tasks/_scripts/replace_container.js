$(document).ready(function() {
  console.log('yep');
  $('.--assignment').each(function(index, el) {
    console.log('rep');
    $(this).parent().replaceTag('a');
    $(this).find('input').attr('disabled', true);
  });
});
