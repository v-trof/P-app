pull_put.delete_action = function() {
  if(pull_put.ui.element) {
    pull_put.ui.element.remove();
  }
}

pull_put.cancel_action = indicator.hide;

generate.editing_actions = ['delete', 'save']
generate.data['question--text'].element.value_sample = {text: "Текст"}

//editor setup
editor.number_selector = '#element-nerver-used';
editor.content_selector = '.__task .__content';
editor.active_types = ['question'];

editor.empty.question.template = $(
'<div class="question--empty --empty ' 
  + editor.empty.question.class+'">'
  + 'Добавьте сюда элемент материала'
+ '</div>'
);
