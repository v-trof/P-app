/**
 * editor UI fixes
 * @type {module}
 */
var editor = {
  empty: {
    question: {
      class: 'm--question-empty',      
    },
    answer: {
      class: 'm--answer-empty', 
    }
  }
}

editor.empty.answer.template = $('<div class="m--empty ' 
                                  + editor.empty.answer.class+'">'
                                  + 'Добавльте ответ'
                                + '</div>'
                                );

editor.empty.question.template = $('<div class="m--empty ' 
                                    + editor.empty.question.class+'">'
                                    + 'Добавльте вопрос'
                                  + '</div>'
                                  );
