editor.check.empty = function() {

  var checkers = [{
    type: 'question',
    action: 'prepend',
    position: 'first'
  }]

  $('.preview ' + '.__task').each(function(index, el) {
    var $content = $(this).children('.__content');
    $content.find('.editor__m--empty').remove();

    if($content.children('[type="question"]').length === 0) {
      $content.find('.__catcher').after(editor.check.create_empty('question'));
    }
  });
}


editor.check.create_empty = function(type) {
  var $empty = $("<div class='editor__m--empty' type='empty'></div>");

  $empty.attr('type', 'question');
  $empty.text(editor.check.empty_text);

  pull_put.put_zone.add($empty, function() {
    $empty.after(editor.active_element.build());
    pull_put.reset();
  });

  indicator.add($empty, 'add', 1);

  return $empty;
}
