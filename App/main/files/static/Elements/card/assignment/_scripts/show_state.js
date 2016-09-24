function assignment_check_done($assignment) {
  var $checkboxes = $assignment.find(".m--checkbox input");
  var $links = $assignment.find("a");
  
  // console.log($checkboxes, $links)
  //checking checkboxes
  var all_checked = true
  $checkboxes.each(function(index, el) {
    // console.log(this);
    if( ! $(this).is(":checked") ) {
      all_checked = false;
    }
  });
  //checking links
  var all_finished = true
  $links.each(function(index, el) {
    // console.log(this);
    if( ! $(this).hasClass('m--done') ) {
      all_finished = false;
    }
  });

  // console.log(all_checked, all_finished);
  if(all_checked && all_finished) {
    $assignment.addClass("m--done");
  } else {
    $assignment.removeClass('m--done');
  }
}

$(document).ready(function() {
  $(".card.m--assignment").each(function(index, el) {
    var $assignment = $(this);
    $(this).on("click", ".m--checkbox", function() {
      assignment_check_done($assignment);
    });

    assignment_check_done($assignment);
  });
});
