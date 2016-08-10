search.fill = function(data) {
  console.log('filling:', data);
  var $links = search.$.find('.__links')
  $links.html('');
  data.forEach(function(item) {
    $new_item = search.build[item.type](item.content);
    $links.append($new_item);
  });
  search.filter();
}

search.template = {
  course: '{% include "Elements/card/course/exports.html" %}',
  test: '{% include "Elements/card/test/exports.html" %}',
  material: '{% include "Elements/card/material/exports.html" %}',
  user: '{% include "Elements/card/user/exports.html" %}',
}


