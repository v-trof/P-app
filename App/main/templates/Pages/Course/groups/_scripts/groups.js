var editing = false;
var e_data = {};
var counter = 0;

var unordered = $();

function drag_over(e) {
	// console.log("over");
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
		e.stopPropagation();
	}
	return false;
}

function drag_reset(){
	tooltip.hide();
	counter=0;
	check_for_emptiness();
}

function check_for_emptiness() {
	$(".group").each(function(index, el) {
	//	console.log($(this).children(".link--card").length, $(this).children("h3").text());
		
		if($(this).children(".link--card").length == 0){
			if($(this).children(".empty").length == 0){
				$(this).append("<div class='empty'>Пустая группа</div>");
			}
		} else {
			$(this).children('.empty').remove();
		}
	});
}


function sort_group(group){
	//better redo it after
	user2names = []
	$(group).find(".card-person").each(function(index, el) {
		user2names.push($(this).find(".card-person__name").text().split(" ")[0])
	});
	
	user2names.sort()

	while(user2names.length > 0){
		$(group).find(".card-person").each(function(index, el) {
			if($(this).find(".card-person__name").text().split(" ")[0] == user2names[0]){
				$(group).append($(this).parent())
				user2names.splice(0,1)
			}
		});
	}
}

var add_boundary = {
	group: function(el){
		el.bind({
			dragover: function(e) {
				drag_over(e);
			},
			dragenter: function(e) {
				$(this).find("*").css('pointer-events', 'none');
				if(e_data.last_el != this){
					drag_reset();
				}
				tooltip.show(this, "Переместить ученика");
				e_data.last_el = this;
			},
			dragleave: function(e) {
				$(this).find("*").css('pointer-events', 'all');
				tooltip.hide();
			},
			drop: function(e) {
				$(this).append(e_data.original_el);
				$(this).find("*").css('pointer-events', 'all');
				tooltip.hide();
			}
		});
	},
	button_remove: function(el){
		el.click(function(event) {
			if($(this).parent(".card").length){
				$(this).parent(".card").parent().remove();
			} else {
				unordered.append($(this).parent(".group").children('.link--card'));
				$(this).parent(".group").remove();
			}
			check_for_emptiness();
		});
	},
	button_remove_all: function(el){
		el.click(function(event) {
			$(this).parent(".group").remove();
		});
	}
}

var button_remove_all = '<button class="button--icon button_remove_all">{% include "UI_elements/Icons/delete_all.svg" %}</button>';

var button_remove = '<button class="button--icon button_remove">{% include "UI_elements/Icons/delete.svg" %}</button>';

var icon_add = '<div class"icon_add--wrapper">{% include "UI_elements/Icons/add.svg" %}</div>';
function toggle_edit(){
	if(editing){
		$("h3").css('border-bottom', '1px dashed transparent').attr("contenteditable", "false");
		$(".button_remove").remove();
		$(".button_remove_all").remove();
		$("#edit>.card--small").text("Редактировать");
		$(".students .link--card").attr("draggable", "false");
		//enabling links
		$(".students .link--card").each(function(index, el) {
			$(this).attr('style', '');
			$(this).attr('draggable', 'false');
			$(this).replaceTag("<a>", true);
		});
		var groups={};
		$(".group").each(function(index, el) {
			group=$(this).children('h3').html();
			groups[group]=[];
			$(this).find('.card-person__name').each(function() {
						console.log("found!");
						groups[group].push($(this).html());
					});
		});
		console.log(groups);
		$.ajax({
			type:"POST",
			url:"/func/edit_groups/",
			data: {
				   'new_groups': JSON.stringify(groups),
				   'csrfmiddlewaretoken': '{{ csrf_token }}',
				   'course_id': "{{course.id}}",
				  },
			success: function(){
				  notification.change('success', 'Группы изменены' );
				  $('#groups_content').load('../groups_content/');
				   }
			});
		$("#create_group").hide();
		editing = false;
	} else {
		$(".group>h3").css('border-bottom', '1px dashed #2196F3').attr("contenteditable", "true");
		$("#edit>.card--small").text("Сохранить изменения");
		$(".students .link--card").attr("draggable", "true");
		//disabling links
		$(".students .link--card").each(function(index, el) {
			$(this).css('cursor', 'move');
			$(this).attr('draggable', 'true');
			$(this).replaceTag("<div>", true);
		});

		$(".students .link--card").bind({
			dragstart: function(e){
				e.originalEvent.dataTransfer.setData('useless', 'stupid firefox');
				e_data.original_el = $(this);
				e_data.original_group = $(this).parent().parent();
			},
			dragend: function(e){
				drag_reset();
			}
		});
		
		$(".students .card-person").prepend(button_remove);
		$(".group").prepend(button_remove);
		$(".group").prepend(button_remove_all);


		unordered.children('.button_remove').remove();
		unordered.children('.button_remove_all').remove();

		unordered.children("h3").css('border-bottom', '1px dashed transparent').attr("contenteditable", "false");

		$(".group>.button_remove").attr('tip', 'Удалить группу, сохранить учеников');

		$(".group>.button_remove_all").attr('tip', 'Удалить группу и учеников');

		$(".card-person>.button_remove").attr('tip', 'Исключить из курса');
		
		$(".button_remove").each(function(index, el) {
			tooltip.generate.tip_based(this);
			add_boundary.button_remove($(this));
		});

		$(".button_remove_all").each(function(index, el) {
			tooltip.generate.tip_based(this);
			add_boundary.button_remove_all($(this));
		});
		
		$("#create_group").show();
		editing = true;
	}
}

$(document).ready(function() {
	check_for_emptiness();


	$("h3").css('border-bottom', '1px dashed transparent');
	$(".students .link--card").attr("draggable", "false");

	$(".group").each(function(index, el) {
		if($(this).children('h3').text() == "Нераспределенные"){
			unordered = $(this);
			if(unordered.find(".card-person").length==0){
				$(".students").append(unordered);
			} else {
				$(".students>h2").after(unordered);
			}
		}
	});

	$("#edit").click(function(event) {
		toggle_edit();
	});

	$("#create_group").click(function(event) {
		var new_group = $("<div class='group'><h3>Новая группа</h3></div>");
		$(".students").append(new_group);
		new_group.prepend(button_remove);
		new_group.prepend(button_remove_all);
		add_boundary.group(new_group);

		add_boundary.button_remove(new_group.find(".button_remove"));
		new_group.find(".button_remove").attr('tip', 'Удалить группу, сохранить учеников')
		tooltip.generate.tip_based(new_group.find(".button_remove")[0]);

		add_boundary.button_remove_all(new_group.find(".button_remove_all"));
		new_group.find(".button_remove_all").attr('tip', 'Удалить группу и учеников')		
		tooltip.generate.tip_based(new_group.find(".button_remove_all")[0]);

		check_for_emptiness();
		new_group.find("h3").css('border-bottom', '1px dashed #2196F3').attr("contenteditable", "true");
		$(".students").append(unordered);
	});
	



	$("#invite_teacher").click(function(event) {
		popup.show("<input type='email' id='email'><label for='email' required>Email</label><br><br><button id='invite_teacher_button'>Пригласить</button>",
		{"width":"20rem"},
		function(){
			add_menu_caller($("#popup .select").get(0));
			$("#popup input")[0].focus();
			$("#invite_teacher_button").click(function(event) {
				var formData = new FormData();
				formData.append('email', $("#email").val());
				formData.append('course_id', "{{course.id}}");
				formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
				processing.button.start($("#invite_teacher_button"));
				$.ajax({
					type:"POST",
					url:"/func/invite_teacher/",
					data: formData,
					processData: false,
					contentType: false,
					success: function(){
						popup.hide();
						notification.change('success', 'Ученики приглашены, ждем от них подтверждения' );
					},
			});
			});
		});
	});
	$("#invite_students").click(function(event) {
		var group_list=[];
		$.ajax({
					type:"POST",
					url:"./func/get_group_list/",
					data:{'csrfmiddlewaretoken': '{{ csrf_token }}'
					},
					async: false,
					success: function(response){
						group_list=$.parseJSON(response);
					},
			});
		popup_data="<input type='email' class='student__email'>" +
			"<label for='email'>Email</label><br>" +
			"<button class='button--icon' id='add_student'><svg  viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/><path d='M0 0h24v24H0z' fill='none'/></svg></button>" +
			"<div class='group select'><div class='display'>Нераспределенные</div>" +
			"<svg class='{{ class }}' id='{{id}}' viewBox='0 0 24 24'  xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>" +
			"<input type='hidden' name='group' class='value'>";
							console.log(group_list);
		$.each(group_list, function( index, value ) {
				popup_data+="<option value='"+value+"'>"+value+"</option>";
		});
		popup_data+="</div>" +
			"<br><br><br><button id='invite_students_button'>Пригласить</button>";
		popup.show(popup_data,{"width":"20rem"},
		function(){
			add_menu_caller($("#popup .select").get(0));
			$("#popup input")[0].focus();
			$("#add_student").click(function(e){
				$("#popup .student__email+label").last().after("<input type='email' class='student__email'><label for='email'>Email</label>");
				add_emptiness_checker($("#popup .student__email").last()[0]);
			});
			$("#invite_students_button").click(function(e) {
				var formData = new FormData();
				var email_list=[];
				$("#popup .student__email").each(function(index, el) {
					email_list.push($(this).val());
				});
				//email_list='"'+email_list.join('","')+'"';
				//console.log(JSON.stringify(email_list))
				formData.append('email_list', JSON.stringify(email_list));
				formData.append('course_id', "{{course.id}}");
				formData.append('csrfmiddlewaretoken', '{{ csrf_token }}');
				formData.append('group', $(".group.select").children("div").text());
				//console.log($(".group.select").children("div").text());
				processing.button.start($("#invite_students_button"));
				$.ajax({
					type:"POST",
					url:"/func/invite_students/",
					data: formData,
					processData: false,
					contentType: false,
					success: function(){
						popup.hide();
						notification.change('success','Ученики приглашены, ждем от них подтверждения' );
					},
			});
			});
		});
	});
	add_boundary.group($(".group"));
	$.extend({
		replaceTag: function (currentElem, newTagObj, keepProps) {
			var $currentElem = $(currentElem);
			var i, $newTag = $(newTagObj).clone();
			if (keepProps) {//{{{
				var nodes=[], values=[];
				newTag = $newTag[0];
				for (var att, i = 0, atts = currentElem.attributes, n = atts.length; i < n; i++){
					att = atts[i];
					newTag.setAttribute(att.nodeName, att.nodeValue);
				}
				$.extend(newTag.classList, currentElem.classList);
				$.extend(newTag.attributes, currentElem.attributes);
			}//}}}
			$currentElem.wrapAll($newTag);
			$currentElem.contents().unwrap();
			// return node; (Error spotted by Frank van Luijn)
			return this; // Suggested by ColeLawrence
		}
	});

	$.fn.extend({
		replaceTag: function (newTagObj, keepProps) {
			// "return" suggested by ColeLawrence
			return this.each(function() {
				jQuery.replaceTag(this, newTagObj, keepProps);
			});
		}
	});
});