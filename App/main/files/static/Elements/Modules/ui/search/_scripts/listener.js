Search._.enable_query_listener = function(search) {
  var timer;
  var typing_interval = 500;

  var $input = search.$.find('.__query');

  $input.keydown(function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      var value = $input.val();
      search.request();
    }, typing_interval);
  });
}


Search._.enable_checkbox_listener = function(search) {
  search.$.find('input[type="checkbox"]').each(function(index, el) {
    var type = $(this).attr('class').slice(7);
    if (search.types_active.indexOf(type) > -1) {
      this.checked = true;
    }
    $(this).change(function() {
      if (this.checked) {
        search.types_active.push(type);
        search.request();
      } else {
        search.types_active.remove(type);
        search.filter();
      }
    });
  });
}
