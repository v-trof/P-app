$(document).ready(function() {
  $(".tests>section").each(function() {
    accordion.add($(this), 'h3');
  });
});
