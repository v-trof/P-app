generate.data["answer--empty"] = {
	element: {
		type: "answer",
		nopull: true,
		parse: function($original) {
			return {
				text: "Добавьте сюда поле ответа",
				class: "answer--empty"
			}
		},
		build: function(value) {
			return $("<div class='--empty answer--empty'>Добавьте сюда поле ответа</div>");
		},
		value_sample: {
			text: "answer"
		}
	},
	edit: {}
},
generate.data["answer--text"] = {
	element: {
		type: 'answer',
		
		parse: function($original) {
			return {
				label: $original.find('label').html(),
				answer: $original.attr('answer'),
				class: "answer--text"
			}
		},

		build: function(value) {
			$element = $(generate.build.template.answer('answer--text'))
			$element.html('{% include "Elements/Inputs/text/exports.html" %}')
			$element.find('label').text(value.label)
			return $element 
		},
		value_sample: {
			label: "Текстовый ответ"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__text/exports.html" %}',
		parse: function() {
			var label = $('#new_element_label').val()
			var answer = $('#new_element_answer').val()

			return {
				'label': label,
				'answer': answer
			}
		},
		fill: function(value) {
			$("#new_element_answer").val(value.answer).focus();
			
			$("#new_element_label").val(value.label).focus();
		}
	}
}
generate.data["answer--textarea"]= {
	element: {
		type: "answer",
		parse: function($original) {
			return {
				label: $original.find('label').html(),
				class: "answer--text"
			}
		},
		build: function(value) {
			$element = $(generate.build.template.answer("answer--textarea"))
			$element.html('{% include "Elements/Inputs/text/textarea/exports.html" %}')
			$element.find("label").text(value.label)
			return $element 
		},
		value_sample: {
			label: "Большой текстовый ответ"
		}
	},
	edit: {
		text: '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__textarea/exports.html" %}',
		parse: function() {
			return {
				label: $("#new_element_label").val()
			}
		},
		fill: function(value) {
			$("#new_element_label").val(value.label).focus();
		}
	}
},
generate.data["question--empty"] = {
	element: {
		type: "question",
		nopull: true,
		parse: function($original) {
			return {
				text: "Добавьте сюда вопрос",
				class: "question--empty"
			}
		},
		build: function(value) {
			return $("<div class='--empty question--empty'>Добавьте сюда вопрос</div>");
		},
		value_sample: {
			text: "Добавьте сюда вопрос"
		}
	},
	edit: {}
},
generate.data["question--image"] = {
	element: {
		type: "question",
		parse: function($original) {
			return {
				url: $original.find("img").attr("src"),
				class: "question--image"
			}
		},
		build: function(value) {

			return $(generate.build.template.question("question--image")).append("<img src="
				+value.url+">")
		},
		value_sample: {
			url: "http://science-all.com/images/wallpapers/hipster-wallpaper/hipster-wallpaper-21.jpg"
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__question/__image/exports.html" %}',
		parse: function() {
			return {
				url: $("#new_element_url").val()
			}
			// else if($("#new_el_file") != "" ) {
			// 	return generate.shared.upload_asset($("#new_el_file").val())
			// }
		},
		fill: function(value) {
			$("#new_element_url").val(value.url).focus()
		}
		// middleware: generate.shared.catch_asset_file
	}
},
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