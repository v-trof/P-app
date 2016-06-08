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