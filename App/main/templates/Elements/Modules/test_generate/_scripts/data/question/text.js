generate.data["question--text"] = {
	element: {
		type: "question",
		parse: function($original) {
			return {
				text: $original.html(),
				class: "question--text"
			}
		},
		build: function(value) {
			console.log(value)
			var $question = $(generate.build.template.question("question--text"))
			
			return $question.html(value.text)
		},
		value_sample: {
			text: "Текстовый вопрос"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__question/__text/exports.html" %}',
		parse: function() {
			console.log($("#new_element_text").html())
			
			return {
				text: $("#new_element_text").html()
			}
		},
		fill: function(value) {
			$("#new_element_text").html(value.text).focus();
		}
	}
},