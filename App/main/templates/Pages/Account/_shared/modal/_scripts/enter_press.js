$(document).ready(function() {
  $('.modal input').keydown(function(event) {
    if(event.keyCode == 13) {
      $('.modal').find('button').click();
    }
  });  
});
