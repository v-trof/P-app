search.enable_query_listener = function() {
  var timer;
  var typing_interval = 500;

  var $input = search.$.find('input');

  $input.keydown(function() {
    clearTimeout(timer); 
    timer = setTimeout(function() {
      var value = $input.val();
      search.request();
    }, typing_interval);
  });
}


search.enable_checkbox_listener = function() {
  search.$.find('input[type="checkbox"]').each(function(index, el) {
    var type = $(this).attr('class').slice(7);
    $(this).change(function() {
      if(this.checked) {
        search.types_active.push(type);
        search.filter();
      } else {
        search.types_active.remove(type);
        search.filter();
      }
    });
  });
}

//remvoe function
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
