search.fill = function(data) {
  var $links = search.$.find('.__links')
  $links.html('');

  if (data.length) {
    data.forEach(function(item) {
      var $new_link = $('<a class="m--card m--' +
        item.type + '" href="' +
        item.content.link + '"></a>');
      $new_item = search.build[item.type](item.content);
      $new_link.append($new_item);
      $links.append($new_link);
    });
    search.filter();
  } else {
    $links.append('<div class="m--empty m--grey">Ничего не найдено</div>');
  }


}

search.template = {
  course: '{% include "Elements/card/course/exports.html" %}',
  test: '{% include "Elements/card/test/exports.html" %}',
  material: '{% include "Elements/card/material/exports.html" %}',
  user: '{% include "Elements/card/user/exports.html" %}',
}
