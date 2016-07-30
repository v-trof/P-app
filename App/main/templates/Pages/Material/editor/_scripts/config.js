pull_put.delete_action = function() {
  if(pull_put.ui.element) {
    pull_put.ui.element.remove();
  }
}

pull_put.cancel_action = indicator.hide;

generate.editing_actions = ['delete', 'save']

//editor setup
editor.number_selector = '.__task .__number';
editor.content_selector = '.__content>.card';
editor.active_types = ['question'];

editor.empty.question.template = $('<div class="--empty ' 
                                    + editor.empty.question.class+'">'
                                    + 'Добавьте сюда что-нибуть'
                                  + '</div>'
                                  );
