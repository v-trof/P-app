var questions = 1;

var question_template = "<div class='test__task'><div class='task__number'></div><div class='card task__content'><div class='task__question'><div class='block--empty'>Добавьте сюда вопрос</div></div><div class='task__answer'><div class='block--empty'>Добавьте сюда поле ответа</div></div></div></div>";

function create_question(el_type, el_class, el) {
	var new_question = $(question_template);

	new_question.find(".task__number").text(questions + ".");
	add_boundary.new_question(new_question.find(".task__number"));
	console.log(el_class, el_type);
	new_question.find(".block--empty").each(function(index, el) {
		add_boundary.block_empty($(this));
	});
	if(el) {
		new_question.find(".task__" + el_type).html($(el));
	} else {
		var new_el = generate[el_class](1);
		if (new_el){
			new_question.find(".task__" + el_type).html(new_el);
			add_boundary.draggable(new_el);
			add_boundary[el_type](new_el);
		}
	}
	$(".test__preview").append(new_question);
	editor.verify_type();
	editor.check_for_emptiness();
	questions++;
	check_bg_height();
}

function append_test_item(el, el_class, el_type) {
	var pos = el.attr('pos');
	var new_item = generate[el_class](1+parseInt(pos));

	el.after(new_item);
	add_boundary.draggable(new_item);
	add_boundary[el_type](new_item);
	
	// console.log($(new_item));
	
	editor.verify_type();
	check_bg_height();
}