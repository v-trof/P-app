var search = (function(){
  var $search = $('{% include "Elements/Modules/search/exports.html" %}');
  var url = window.location.pathname;
  
  var exports = {
    $: $search,
    is_shown: false,
    show: function() {
      $search.removeClass('m--hidden');
      $search.find('input').focus();
      search.is_shown = true;
    },
    hide: function() {
      $search.addClass('m--hidden');
      search.is_shown = false;
    },
    types: ['user', 'course', 'test', 'material'],
    types_active: ['user', 'course', 'test', 'material']
  };

  if(url.indexOf('course') > -1 ) {
    exports.course_id = '{{course.id}}';
  }

  return exports;
})();

$(document).ready(function() {
  console.log(search.$)
  $('body').append(search.$);
  $('.header>.__search>button').click(function() {
    if( ! search.is_shown) {
      search.show();
    } else {
      search.hide();
    }
  });
  search.$.find('.m--close').click(function(event) {
    search.hide();
  });
  
  search.enable_query_listener();
  search.enable_checkbox_listener();
});
