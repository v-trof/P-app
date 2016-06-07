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