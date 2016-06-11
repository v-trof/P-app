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
}
generate.data["answer--radio"] = {
	element: {
		type: 'answer',
		
		parse: function($original) {
			var $items = $original.find(".--radio");
			var values = [];
			$items.each(function(index, el) {
				values.push($(this).children("label").text());
			});

			console.log(values);
			return {
				values: values,
				answer: $original.attr('answer'),
				class: "answer--radio"
			}
		},

		build: function(value) {
			$element = $(generate.build.template.answer('answer--radio'))
			value.values.forEach(function(label) {
				var $new_option = $('{% include "Elements/Inputs/radio/exports.html" %}');
				$new_option.children("label").text(label)

				$element.append($new_option);

			});

			return $element 
		},
		getter: function($element, _action) {
			//fuck gg
		},
		value_sample: {
			values: ["Вариант 1", "Вариант 2", "Вариант 3"]
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__radio/exports.html" %}',
		parse: function() {
			var $items = $(".radio-edit").find(".--radio");
			var answer;
			var values = [];

			$items.each(function(index, el) {
				var label = $(this).siblings().find(".__value").val();

				values.push(label);
				
				if($(this).find("input").is(":checked")) {
					answer = label;
				}
			});

			return {
				values: values,
				answer: answer
			}
		},
		middleware: function() {
			var empty_item = '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__radio/__item/exports.html" %}';

			generate.data.shared.add_item = function() {
				var $new_item = $(empty_item);
				
				$(".radio-edit .__items").append($new_item);
				button_delete.add($new_item);
			}

			$(".radio-edit .__add").click(function(event) {
				generate.data.shared.add_item();
			});
		},
		fill: function(value) {
			value.values.forEach(function(label) {
				generate.data.shared.add_item();
				$(".radio-edit .__items").children().last()
					.find(".__value").val(label);
				if(label === value.answer) {
					$(".radio-edit .__items").children().last()
						.find(".--radio input").prop("checked", true);
				}
			});
		}
	}
}
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
		getter: function($element, _action) {
			var timer;
			var typing_interval = 1000;

			$element.on("blur mouseout", function() {
				var value = $element.find(".__value").val();
				_action(value);
			});
			
			$element.keydown(function(event) {
				$element.keydown(function() {
					clearTimeout(timer); 
					timer = setTimeout(function() {
						var value = $element.find(".__value").val();
						_action(value);
					}, typing_interval);
				});
			});
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
			console.log("parsed");
			return {
				label: $original.find('label').html(),
				class: "answer--textarea"
			}
		},
		build: function(value) {
			$element = $(generate.build.template.answer("answer--textarea"))
			$element.html('{% include "Elements/Inputs/text/textarea/exports.html" %}')
			$element.find("label").text(value.label)
			return $element 
		},
		getter: function($element, _action) {
			var timer;
			var typing_interval = 1000;

			$element.on("blur mouseout", function() {
				var value = $element.find(".__value").text().substring(0, 17);
				_action(value);
			});
			
			$element.keydown(function(event) {
				$element.keydown(function() {
					clearTimeout(timer); 
					timer = setTimeout(function() {
						var value = $element.find(".__value").text().substring(0, 17);
						_action(value);
					}, typing_interval);
				});
			});
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
}
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
}
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
}
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
			return {
				text: $("#new_element_text").html()
			}
		},
		fill: function(value) {
			$("#new_element_text").html(value.text).focus();
		}
	}
}