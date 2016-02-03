var generate  = {
	queued_el: $("<div>Ждем-с</div>"),
	quesiton_template : "<div draggable='true'></div>",
	answer_template : function(el_class) {
		return "<div class='"+el_class+" task__answer__item' draggable='true'></div>"
	},
	"texts" : {
		"text-wrapper": "<input type='text' id='new_el_value'><label>Текст вопроса</label><br><br><button id='add_el'>Добавить</button>",
		"image-wrapper": "<input type='text' id='new_el_value'><label>URL артинки</label><br><br><div class='file'><button>Выбрать</button><span>Файл не выбран</span><input type='file'></div><br><br><button id='add_el'>Добавить</button>",
		"text-answer": "<input type='text' id='new_el_value'><label>Вопрос</label><br><br><input type='text' id='new_el_answer'><label>Верный ответ</label><br><br><button id='add_el'>Добавить</button>",
		"select-answer": "<ul class='select-option-list'><li><input type='radio' name='right_answer' checked id='option_1'><label for='option_1'></label><div><input type='text'><label>Вариант ответа</label></div></li></ul><button class='button--icon' id='add_option'><svg  viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/><path d='M0 0h24v24H0z' fill='none'/></svg></button><br><button id='add_el'>Добавить</button>"
	},
	"text-wrapper" : function(value, original) {
		var quesiton_template = $(generate.quesiton_template); //lets us modfy freely
		if(!value) {
			var prefill;
			popup.show(generate.texts["text-wrapper"],{}, function() {
				if(original) {
					$("#new_el_value").val(original.text());
				}
				$("#add_el, #popup__close").click(function(event) {
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
	"image-wrapper" : function(value, original) {
		var quesiton_template = $(generate.quesiton_template); //lets us modfy freely
		if(!value) {
			var prefill;
			popup.show(generate.texts["image-wrapper"],{}, function() {
				if(original) {
					$("#new_el_value").val(original.find("img").attr("src"));
				}
				$("#add_el, #popup__close").click(function(event) {
					popup.hide();
					if($("#new_el_value").val()!=""){
						c_element = generate["image-wrapper"]($("#new_el_value").val());
						generate.queued_el.replaceWith(c_element);
						add_boundary.draggable(c_element);
						add_boundary.question(c_element);
					}
				});
			});
			var content = generate.queued_el;
		} else {
			var content = quesiton_template.addClass("image-wrapper").append("<img src="+value+">");
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
				$("#add_el, #popup__close").click(function(event) {
					popup.hide();
					console.log("add");
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
	"file-answer": function() {
		var content = $(generate.answer_template("file-answer")).html("<div class='file'><button>Выбрать</button><span>Файл не выбран</span><input type='file'></div></div>");
		add_boundary.draggable(content);
		add_boundary.answer(content);

		return content;
	},
	"select-answer": function(value, answer, original) {
		if(!value) {
			var prefill;
			popup.show(generate.texts["select-answer"],{"width":"21rem"}, function() {
				if(original) {
					console.log(original);
					$(".select-option-list").html("");
					original.find('option').each(function(index, el) {
					$(".select-option-list").append("<li><input type='radio' name='right_answer' id='option_"+index+"'><label for='option_"+index+"'></label><div><input type='text'><label>Вариант ответа</label></div></li>").children('li').last().find("input[type='text']").val($(this).text());
					});
					$("#option_"+$(original).attr("answer")).attr('checked', "");
				}
				var option_counter = 0;
				$("#add_option").click(function(event) {
					option_counter++;
					$(".select-option-list").append("<li><input type='radio' name='right_answer' id='option_"+option_counter+"'><label for='option_"+option_counter+"'></label><div><input type='text'><label>Вариант ответа</label></div></li>");
				});
				$("#add_el, #popup__close").click(function(event) {
					popup.hide();
					console.log("add");
					var values = [];
					var answer = "";

					$("#popup li").each(function(index, el) {
						var text = $(this).find("input[type='text']").val();
						if($(this).children("input[type='radio']").is(":checked")){
							answer = index;
						}
						values.push(text);
					});
					console.log(values);
					c_element = generate["select-answer"](values, answer);
					generate.queued_el.replaceWith(c_element);
					add_boundary.draggable(c_element);
					add_boundary.answer(c_element);
				});
			});
			var content = generate.queued_el;
		} else {
			var content = $(generate.answer_template("select-answer")).html("<div class='select'><input type='hidden' class='value' value='1'><div class='display'>"+value[0]+"</div><svg class='{{ class }}' id='{{id}}' viewBox='0 0 24 24'  xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
			var select = $(content).find(".select");
			var counter=1;
			var answer_found = false;
			value.forEach(function(text){
				select.append("<option value='"+counter+"'>"+text+"</option>");
				counter++;
			});
			content.attr("answer", answer);
			add_menu_caller(select);
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