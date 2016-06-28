generate.data["answer--checkbox"] = {
	element: {
		type: 'answer',
		
		parse: function($original) {
			return generate.data.shared
				.options.element.parse($original, "checkbox");
		},

		build: function(value) {
			if (value.answer) {
				value.answer = value.answer.join(', ');
			}
			
			$element = $(generate.build.template.answer('answer--checkbox'))
			
			value.values.forEach(function(label) {
				var $new_option = $('{% include "Elements/Inputs/checkbox/exports.html" %}');
				$new_option.children("label").text(label);
				$new_option.children("input").val(label);
				$new_option.children("input")
					.attr("name", "c_"+generate.counter.checkbox);
				$element.append($new_option);
			});

			generate.counter.checkbox++;

			return $element 
		},
		getter: function($element, _action) {
			$element.change(function(event) {
				var values = [];
				$element.find(":checked").each(function(index, el) {
					values.push( $(this).val() );
				});;
				_action(values.join(", "));
			});
			
		},
		value_sample: {
			values: ["Вариант 1", "Вариант 2", "Вариант 3"]
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__checkbox/exports.html" %}',
		parse: function() {
			var result = generate.data.shared.options.edit.parse("checkbox");

			return result
		},
		middleware: function() {
			generate.data.shared.options.edit.middleware("checkbox");
		},
		fill: function(value) {
			generate.data.shared.options.edit.fill(value);
		}
	}
}
generate.data["answer--empty"] = {
	element: {
		type: "answer",
		nopull: true,
		parse: function($original) {
			return {
				text: "Добавьте сюда поле ответа",
				class: "answer--empty",
				type: "answer"
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
			return generate.data.shared
				.options.element.parse($original, "radio");
		},

		build: function(value) {
			$element = $(generate.build.template.answer('answer--radio'))
			
			value.values.forEach(function(label) {
				var $new_option = $('{% include "Elements/Inputs/radio/exports.html" %}');
				$new_option.children("label").text(label);
				$new_option.children("input").val(label);
				$new_option.children("input")
					.attr("name", "r_"+generate.counter.radio);
				$element.append($new_option);
			});
			generate.counter.radio++;

			return $element 
		},
		getter: function($element, _action) {
			$element.change(function(event) {
				var value = $element.find(":checked").val();
				_action(value);
			});
		},
		value_sample: {
			values: ["Вариант 1", "Вариант 2", "Вариант 3"]
		}
	},
	edit: {
		text:  '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__radio/exports.html" %}',
		parse: function() {
			var result = generate.data.shared.options.edit.parse("radio");

			if(result.answer) {
				result.answer = result.answer[0]
			}
			return result
		},
		middleware: function() {
			generate.data.shared.options.edit.middleware("radio");
		},
		fill: function(value) {
			generate.data.shared.options.edit.fill(value);
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
				class: "answer--text",
				type: "answer"
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

			$element.on("change", function() {
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

			return {
				label: $original.find('label').html(),
				class: "answer--textarea",
				type: "answer"
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

			$element.on("change", function() {
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
				class: "question--empty",
				type: "question"
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
				class: "question--image",
				type: "question"
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
				class: "question--text",
				type: "question"
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
generate.data.shared.options = {
	element: {
		parse: function($original, type) {
			var $items = $original.find(".--" + type);
			var values = [];
			$items.each(function(index, el) {
				values.push($(this).children("label").text());
			});

			// getting answer
			if ($original.attr('answer')) {
				answer = $original.attr('answer').split(", ");
			} else {
				answer = [];
			}

			if(type === "radio" && answer) {
					answer = answer[0];
				}

			return {
				values: values,
				answer: answer,
				class: "answer--" + type,
				type: "answer"
			}
		}
	},
	edit: {
		parse : function(type) {

			var $items = $(".options-edit").find(".--"+type);
			var answer = [];
			var values = [];

			$items.each(function(index, el) {
				var label = $(this).siblings().find(".__value").val();

				values.push(label);
				
				if($(this).find("input").is(":checked")) {
					answer.push(label);
				}
			});

			return {
				values: values,
				answer: answer
			}
		},
		middleware: function(type) {
			var middleware_text = {
				radio : '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__radio/__item/exports.html" %}',
				checkbox : '{% include "Elements/Modules/test_generate/__edit_texts/__answer/__checkbox/__item/exports.html" %}'
			}
			var empty_item = middleware_text[type];

			generate.data.shared.add_item = function() {
				var $new_item = $(empty_item);
				
				$(".options-edit .__items").append($new_item);
				button_delete.add($new_item);
			}

			$(".options-edit .__add").click(function(event) {
				generate.data.shared.add_item();
			});
		},
		fill: function(value) {
			value.values.forEach(function(label) {
				generate.data.shared.add_item();
				$(".options-edit .__items").children().last()
					.find(".__value").val(label);

				
				var checker = function() {return false};

				if(typeof value.answer === "string") {
					checker = function(answer, item) {
						return item === answer;
					}
				} else if(typeof value.answer === "object") {
					checker = function(answer, item) {
						return (answer.indexOf(item) > -1);
					}
				}

				if( checker(value.answer, label) ) {
					console.log("ok")
					$(".options-edit .__items").find("label input")
						.last().prop("checked", true);
				}
			});
		}
	}
}