generate.data["question--empty"] = {
  element: {
    type: "question",
    nopull: true,
    parse: function($original) {
      return {
        text: "Добавьте сюда вопрос",
        class: "question--empty",
        type: "question"
      }
    },
    build: function(value) {
      return $("<div class='m--empty question--empty'>Добавьте сюда вопрос</div>");
    },
    value_sample: {
      text: "Добавьте сюда вопрос"
    }
  },
  edit: {}
}
