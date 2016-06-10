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