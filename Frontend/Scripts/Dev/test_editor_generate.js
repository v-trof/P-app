var generate  = {
	queued_el: $("<div>Ждем-с</div>"),
	quesiton_template : "<div draggable='true'></div>",
	answer_template : function(el_class) {
		return "<div class='"+el_class+" task__answer__item' draggable='true'></div>"
	},
	"texts" : {
		"text-wrapper": "<input type='text' id='new_el_value'><label>Текст вопроса</label><br><br><button id='add_el'>Добавить</button>",
		"text-answer": "<input type='text' id='new_el_value'><label>Формат ответа</label><br><br><input type='text' id='new_el_answer'><label>Верный ответ</label><br><br><button id='add_el'>Добавить</button>"
	},
	"text-wrapper" : function(value, original) {
		var quesiton_template = $(generate.quesiton_template); //lets us modfy freely
		if(!value) {
			var prefill;
			popup.show(generate.texts["text-wrapper"],{}, function() {
				if(original) {
					$("#new_el_value").val(original.text());
				}
				$("#add_el, #overlay__bg").click(function(event) {
					popup.hide();
					c_element = generate["text-wrapper"]($("#new_el_value").val());
					generate.queued_el.replaceWith(c_element);
					add_boundary.draggable(c_element);
					add_boundary.question(c_element);
				});
			});
			var content = generate.queued_el;
		} else {
			var content = quesiton_template.addClass("text-wrapper").html(value);
		}
		console.log(content);
		return content;
	},
	"text-answer": function(value, answer, original) {
		
		if(!value) {
			var prefill;
			popup.show(generate.texts["text-answer"],{}, function() {
				if(original) {
					$("#new_el_value").val(original.find("label").text());
					$("#new_el_answer").val(original.attr("answer"));
				}
				$("#add_el, #overlay__bg").click(function(event) {
					popup.hide();
					c_element = generate["text-answer"]($("#new_el_value").val(), $("#new_el_answer").val());
					generate.queued_el.replaceWith(c_element);
					add_boundary.draggable(c_element);
					add_boundary.answer(c_element);
				});
			});
			var content = generate.queued_el;
		} else {
			var content = $(generate.answer_template("text-answer")).attr("answer", answer).html("<input type='text' placeholder='Ответ' disabled><label>"+value+"</label>");
		}
		return content;
	},
	task: function(task_data){
		var new_task = $(task_template);
		new_task.find(".task__number").text(tasks + ".");
		add_boundary.new_task(new_task.find(".task__number"));
		new_task.find(".block--empty").each(function(index, el) {
			add_boundary.block_empty($(this));
		});

		$(".test__preview").append(new_task);

		new_task.find(".task__question").html("");
		new_task.find(".task__answer").html("");
		task_data.answer_items.forEach(function(element) {
			console.log(element["class"]);
			if(element["class"] == "block--empty") {
				var new_element = $("<div class='block--empty'>Добавьте сюда поле ответа</div>");
				new_task.append();
				add_boundary.block_empty(new_element);
			} else {
				var new_element = generate[element["class"]](element["label"],element["answer"]);
				new_task.find(".task__answer").append(new_element);
				add_boundary.draggable(new_element);
				add_boundary["answer"](new_element);
			}
		});
		task_data.question_items.forEach(function(element) {
			console.log(element["class"]);
			if(element["class"] == "block--empty") {
				var new_element = $("<div class='block--empty'>Добавьте сюда вопрос</div>");
				new_task.append();
				add_boundary.block_empty(new_element);
			} else {
				var new_element = generate[element["class"]](element["value"]);
				console.log(new_element, new_task.find(".task__question"));
				new_task.find(".task__question").append(new_element);
				console.log(new_task.find(".task__question"));
				add_boundary.draggable(new_element);
				add_boundary["question"](new_element);
			}
			
		});
		
		editor.verify_type();
		editor.check_for_emptiness();
		check_bg_height();
	}
}