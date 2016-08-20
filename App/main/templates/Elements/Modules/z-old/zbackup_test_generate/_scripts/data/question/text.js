generate.data["question--text"] = {
  element: {
    type: "question",
    parse: function($original) {
      var html = $original.children('.__text-content').html();
      return {
        text: html,
        class: "question--text",
        type: "question"
      }
    },
    build: function(value) {
      var $question = $(generate.build.template.question("question--text"))
      var $content = $("<div class='__text-content'></div>");
      $content.html(value.text);
      return $question.html($content);
    },
    value_sample: {
      text: "Текстовый вопрос"
    }
  },
  edit: {
    text:  '{% include "Elements/Modules/test_generate/__edit_texts/__question/__text/exports.html" %}',
    parse: function() {      
      return {
        text: $("#new_element_text").html()
      }
    },
    middleware: function() {
      inline_editor.start($('#new_element_text')[0]);
    },
    fill: function(value) {
      $("#new_element_text").html(value.text).focus();
    }
  }
}
