if( ! used_links) {
	var used_links = []
}

{% if task %}
	var loaded = true
	var task_id = "{{task.id}}"
{% else %}
	var loaded = false
{% endif %}

var as_g = {}
as_g.current_type = ""
as_g.original = $()

as_g.card_template = function(el) { 
	return '<div class="card m--small" href="'+el.link+'">'+el.title+'</div>'
}

as_g.material_list = {{course.materials|safe}}
as_g.test_list = {{course.tests|safe}}

as_g.show_list = function(content_type, original) {
	var dict = as_g[content_type+"_list"];
	as_g.current_type = content_type;
	as_g.original = original;

	panel.show();
	panel.content.html("");
	$.each(dict,function(section,value) {
		var $new_section = $("<section><h3>"+section+"</h3></section>")

		panel.content.append($new_section);
		accordion.add($new_section, "h3");
		
		value.forEach(function(el) {
			if(used_links.indexOf(el.link) == -1) {
				$new_section.append(as_g.card_template(el));
			}
		});
	});

	if(original) {
		as_g.delete.show();
	} else {
		as_g.delete.hide();
	}
}

as_g.hide_list = function(content_type) {
	panel.hide();
}

$(document).ready(function() {
	//var pickerDefault = new Pikaday(
	//  {
	//  field: document.getElementById('due_date'),
	//  });
	

	$("#assignment--new__add_test").click(function(event) {
		as_g.show_list("test");
	});
	$("#assignment--new__add_material").click(function(event) {
		as_g.show_list("material");
	});

	$("#assignment--new__materials").on("click", ".card.m--small", function(event) {
			as_g.show_list("material", $(this))
	});

	$("#assignment--new__tests").on("click", ".card.m--small", function(event) {
			as_g.show_list("test", $(this))
	});
	setTimeout(function() {
		as_g.cancel = $("#cancel")
		as_g.delete = $("#delete")
	}, 100)
});
$("#assignment--new__add_traditional").click(function(event) {
	popup.show('{% include "Pages/Course/give_task/_popup_texts/add_traditional/exports.html" %}');
	$("#add_el").click(function(event) {
		// console.log(el_data)
		popup.hide()
		$("#assignment--new__add_traditional").before(as_g.card_template(
				{"title": $("#new_el_value").html()}
			))
	})
	$("#popup__close").click(function(event) {
		popup.hide()
	})
});
$("#assignment--new__traditional").on("click", ".card.m--small", function(event) {
	as_g.original = $(this)
	popup.show('{% include "Pages/Course/give_task/_popup_texts/add_traditional/exports.html" %}');
	$("#new_el_value").html(as_g.original.html()).focus();
	popup.$.find(".row").append('<button id="delete_el" class="button m--ghost m--negative">Удалить</button>')
	$("#add_el").click(function(event) {
		// console.log(el_data)
		popup.hide()
		as_g.original.replaceWith(as_g.card_template(
				{"title": $("#new_el_value").html()}
			))
	})
	$("#delete_el").click(function(event) {
		popup.hide();
		$("#delete").click();
	});
	});
{% if task %}
	$("#give_task").text("Сохранить изменения");
{% endif %}
$("#give_task").click(function(e) {
	var data = parse_assignment();
	data.csrfmiddlewaretoken = '{{csrf_token}}';
	data.course_id = '{{course.object.id}}';
	
	// console.log(data);
	
	if(loaded) {
		ajax_edit(data);
	}
	else {
		ajax_create(data);
	}
});
