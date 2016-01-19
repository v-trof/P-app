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
	}
}