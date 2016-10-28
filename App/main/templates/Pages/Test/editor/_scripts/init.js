editor.check.empty_text = 'Добавьте сюда элемент вопроса';

editor.fill_item_list(
  $('.item-list.m--question'), 'question'
);

editor.fill_item_list(
  $('.item-list.m--answer'), 'answer'
);


test_manager.publish_popup = '{% include "Pages/Test/editor/_publish_popup/exports.html" %}'
