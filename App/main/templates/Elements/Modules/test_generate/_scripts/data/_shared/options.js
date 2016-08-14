generate.data.shared.options = {
	element: {
		parse: function($original, type) {
			var $items = $original.find(".m--" + type);
			var values = [];
			$items.each(function(index, el) {
				values.push($(this).children("label").text());
			});

			// getting answer
			var answer_attr = $original.attr('answer');
			console.log(answer_attr);
			if(answer_attr) {
				if(type === "radio") {
					answer = answer_attr;
				} else {
					answer = JSON.parse(answer_attr);
				}
			} else {
				answer = [];
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

			var $items = $(".options-edit").find(".m--"+type);
			var answer = [];
			var values = [];

			$items.each(function(index, el) {
				var label = $(this).siblings().find(".__value").val();

				values.push(label);
				
				if($(this).find("input").is(":checked")) {
					answer.push(label);
				}
			});

			console.log(answer, typeof answer)

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
					// console.log("ok")
					$(".options-edit .__items").find("label input")
						.last().prop("checked", true);
				}
			});
		}
	}
}
