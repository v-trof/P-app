generate.data.shared.worth = {
  element: {
    parse: function($original) {
      return $original.attr('worth');
    },
    build: function($new_element, value) {
      $new_element.attr('worth',  value);
    }
  },
  edit: {
    parse: function() {
      var worth = parseInt($('#max_mark').val());
      if( ! worth > 0) {
        worth = 1;
      }
      
      return worth;
    },
    middleware: function() {
        setTimeout(function() {
         if($('#max_mark').val() === '') {
            $('#max_mark').val(1);
          }
        }, 100);
      $('#max_mark').parent().find('label').addClass('m--top');
    },
    fill: function(value) {
      $('#max_mark').val(value);
    }
  }
}
