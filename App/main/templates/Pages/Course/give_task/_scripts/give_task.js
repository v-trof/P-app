var as_g = {}
	as_g.current_type = ""
	as_g.original = $()

	as_g.card_template = function(el){ 
		return '<div class="card --small" href="'+el.href+'">'+el.title+'</div>'
	}
	
	as_g.material_list = {{course.material_list|safe}}
	as_g.test_list = {{course.test_list|safe}}
	console.log(as_g.test_list,as_g.material_list);
	as_g.show_list = function(content_type, original){
		var list = as_g[content_type+"_list"];
		as_g.current_type = content_type;
		as_g.original = original;

		panel.show();
		panel.content.html("");
		list.forEach(function(el){
			console.log(el);
			panel.content.append(as_g.card_template(el));
		})

		if(original){
			as_g.delete.show();
		} else {
			as_g.delete.hide();
		}
	}

	as_g.hide_list = function(content_type){
		panel.hide();
	}

	$(document).ready(function() {
		//var pickerDefault = new Pikaday(
	  //  {
	  //      field: document.getElementById('due_date'),
	  //  });
		panel.actions.html('<button class="--ghost" id="cancel">Отмена</button><button class="--ghost --negative" id="delete">Удалить</button>');
		$("#delete").css('color', '#F44336');

		$("#assignment--new__add_test").click(function(event) {
			as_g.show_list("test");
		});
		$("#assignment--new__add_material").click(function(event) {
			as_g.show_list("material");
		});

		panel.$.click(function(event) {
			as_g.hide_list()
		});

		panel.$.on("click", ".card.--small", function(event) {
			if(as_g.original){
				as_g.original.replaceWith($(this))
			} else {
				$("#assignment--new__add_"+as_g.current_type).before($(this))
			}
			
		});

		$("#assignment--new__materials").on("click", ".card.--small", function(event) {
				as_g.show_list("material", $(this))
		});

		$("#assignment--new__tests").on("click", ".card.--small", function(event) {
				as_g.show_list("test", $(this))
		});
		setTimeout(function(){
			as_g.cancel = $("#cancel")
			as_g.delete = $("#delete")
			$("#delete").click(function(event) {
				as_g.original.remove()
			});
		}, 100)
	});
	$("#assignment--new__add_traditional").click(function(event) {
		popup.show('{% include "Pages/Course/give_task/_popup_texts/add_traditional/exports.html" %}');
		$("#add_el").click(function(event) {
			// console.log(el_data)
			popup.hide()
			$("#assignment--new__add_traditional").before(as_g.card_template(
					{"title": $(".__value").html()}
				))
		})
		$("#popup__close").click(function(event) {
			popup.hide()
		})
	});
	$("#assignment--new__traditional").on("click", ".card--small", function(event) {
		as_g.original = $(this);
		popup.show('{% include "Pages/Course/give_task/_popup_texts/add_traditional/exports.html" %}'+'<button id="delete_el" class="button--ghost">Удалить</button>');
		$("#new_el_value").text(as_g.original.text())
		$("#add_el").click(function(event) {
			// console.log(el_data)
			popup.hide()
			as_g.original.replaceWith(as_g.card_template(
					{"title": $("#new_el_value").text()}
				))
		})
		$("#delete_el").click(function(event) {
			popup.hide()
			$("#delete").click()
		});
		$("#popup__close").click(function(event) {
			popup.hide()
		})
		});

	$("#give_task").click(function(e) {
		var res_material_list=[];
		var res_test_list=[];
		var traditionals_list=[];
		var material={};
		var due_date="";
		$("#assignment--new__materials .card.--small").each(function(index, el) {
			material.link=$(this).attr('href');
			material.title=$(this).html();
			material.done=false;
			res_material_list.push(material);
			material={};
		});
		$("#assignment--new__tests .card.--small").each(function(index, el) {
			material.link=$(this).attr('href');
			material.title=$(this).html();
			material.done=false;
			res_test_list.push(material);
			material={};
		});
		var material={};
		$("#assignment--new__traditional .card.--small").each(function(index, el) {
			traditionals_list.push($(this).html());
		});
		due_date=$("#due_date").val();
		console.log("test",res_test_list);
		console.log("mat",res_material_list);
		console.log("trad",traditionals_list);
		console.log("due_date",due_date);
        $.ajax({
            type:"POST",
            url:"/func/create_assignment/",
            data: {
                   'csrfmiddlewaretoken': '{{ csrf_token }}',
                   'material_list': JSON.stringify(res_material_list),
                   'test_list': JSON.stringify(res_test_list),
                   'traditionals_list': JSON.stringify(traditionals_list),
                   'due_date': due_date,
                   'course_id': '{{ course.object.id }}'
                  },
            success: function(){
                  notification.show('success','Задание создано' );
                               }
            });
    });