pull_put.delete_action = function() {
	if(pull_put.ui.element) {
		pull_put.ui.element.remove();
	}
}


generate.editing_actions = ['delete', 'add', 'save']

//editor setup
editor.number_selector = '.__task .__number';
editor.content_selector = '.__task .__content';
editor.active_types = ['question', 'answer'];

editor.empty.answer.template = $('<div class="--empty ' 
                                  + editor.empty.answer.class+'">'
                                  + 'Добавьте сюда поле ответа'
                                + '</div>'
                                );

editor.empty.question.template = $('<div class="--empty ' 
                                    + editor.empty.question.class+'">'
                                    + 'Добавьте сюда вопрос'
                                  + '</div>'
                                  );
