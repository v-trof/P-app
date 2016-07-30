pull_put.delete_action = function() {
	if(pull_put.ui.element) {
		pull_put.ui.element.remove();
	}
}

pull_put.cancel_action = indicator.hide;

generate.editing_actions = ['delete', 'add', 'save']

//editor setup
editor.number_selector = '.__task .__number';
editor.content_selector = '.__task .__content';
editor.active_types = ['question', 'answer'];

editor.empty.answer.template = $(
  '<div class="answer--empty --empty ' 
    + editor.empty.answer.class+'">'
    + 'Добавьте сюда поле ответа'
  + '</div>'
);

editor.empty.question.template = $(
'<div class="question--empty --empty ' 
  + editor.empty.question.class+'">'
  + 'Добавьте сюда вопрос'
+ '</div>'
);
