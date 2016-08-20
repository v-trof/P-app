scroll = {
  wire: function($trigger, $destination, $parent) {
    var margin = parseInt($(".main").css("margin-top"));
    
    $trigger = $($trigger);
    $destination = $($destination).first();

    if(typeof $parent === 'undefined') {
      $parent = $(document);
    }

    // console.log($parent)

    $trigger.click(function(event) {
      $parent.scrollTo($destination, 300, {offset:-margin});
    });
  }
}
