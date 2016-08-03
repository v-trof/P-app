$(document).ready(function() {
  var today = new Date();

  $('.__due-date input').pickmeup({
    format: 'd-m-Y',
    min: today
  })
});
