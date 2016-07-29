var editor = {
  empty: {
    question: {
      class: '--question-empty',      
    },
    answer: {
      class: '--answer-empty', 
    }
  }
}

editor.empty.answer.template = $('<div class="--empty ' 
                                  + editor.empty.answer.class+'">'
                                  + 'Добавльте ответ'
                                + '</div>'
                                );

editor.empty.question.template = $('<div class="--empty ' 
                                    + editor.empty.question.class+'">'
                                    + 'Добавльте вопрос'
                                  + '</div>'
                                  );
