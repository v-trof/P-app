pull_put.delete_action = function() {
	if(pull_put.ui.element) {
		pull_put.ui.element.remove();
	}
}

pull_put.reset_sync = true;

pull_put.pre_reset = function(_callback) {
  // console.log("Pre reset", pull_put.ui.element);
  // generate.let_editing(pull_put.ui.element);
  _callback();
}

pull_put.cancel_action = indicator.hide;
pull_put.ui.additional_margin = 24

generate.editing_actions = ['delete', 'add', 'save']

//editor setup
editor.number_selector = '.__task .__number';
editor.content_selector = '.__task .__content';
editor.active_types = ['question', 'answer'];

editor.empty.answer.template = $(
  '<div class="answer--empty m--empty ' 
    + editor.empty.answer.class+'">'
    + 'Добавьте сюда поле ответа'
  + '</div>'
);

editor.empty.question.template = $(
'<div class="question--empty m--empty ' 
  + editor.empty.question.class+'">'
  + 'Добавьте сюда вопрос'
+ '</div>'
);
