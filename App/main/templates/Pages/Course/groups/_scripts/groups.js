var editing = false;
var e_data = {};
var counter = 0;

var unordered = $();

function check_for_emptiness() {
	$(".group").each(function(index, el) {
		if($(this).children(".--card").length == 0){
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
	button_delete: function(el){
		el.click(function(event) {
			if($(this).parent(".card").length){
				$(this).parent(".card").parent().remove();
			} else {
				unordered.append($(this).parent(".group").children('.--card'));
				$(this).parent(".group").remove();
			}
			check_for_emptiness();
		});
	},
	button_delete_all: function(el){
		el.click(function(event) {
			$(this).parent(".group").remove();
		});
	}
}

var icon_add = '<div class"icon_add--wrapper">{% include "Elements/Icons/add.svg" %}</div>';

function toggle_edit(){
	if(editing){
		$("h3").css('border-bottom', '1px dashed transparent').attr("contenteditable", "false");
		$(".--button-delete").remove();
		$(".--button-delete_all").remove();
		$("#edit>.card--small").text("Редактировать");
		$(".students .--card").attr("draggable", "false");
		//enabling links
		$(".students .--card").each(function(index, el) {
			$(this).attr('style', '');
			$(this).replaceTag("<a>", true);
		});
		var groups={};
		$(".group").each(function(index, el) {
			group=$(this).children('h3').html();
			groups[group]=[];
			$(this).find('.card-person__name').each(function() {
						groups[group].push($(this).html());
					});
		});
		$.ajax({
			type:"POST",
			url:"/func/edit_groups/",
			data: {
				   'new_groups': JSON.stringify(groups),
				   'csrfmiddlewaretoken': '{{ csrf_token }}',
				   'course_id': "{{course.id}}",
				  },
			success: function(){
				  notification.show('success', 'Группы изменены' );
				  $('#groups_content').load('../groups_content/');
				   }
			});
		$("#create_group").hide();
		editing = false;
	} else {
		$(".group>h3").css('border-bottom', '1px dashed #2196F3').attr("contenteditable", "true");
		$("#edit>button").text("Сохранить изменения");
		//disabling links
		$(".students .--card").each(function(index, el) {
			$(this).replaceTag("<div>", true);
		});
		$(".students .card-person").each(function(index, el) {
			console.log(this);
			button_delete.add($(this), function() {
				//delete_user($(el));
			});
		});
		$(".group").each(function(index, el) {
			button_delete.add($(this), function() {
				//delete_user($(el));
			});
		});

		unordered.children('.--button-delete').remove();
		unordered.children('.--button-delete_all').remove();

		unordered.children("h3").css('border-bottom', '1px dashed transparent').attr("contenteditable", "false");

		$(".group>.--button-delete").attr('tip', 'Удалить группу, сохранить учеников');

		$(".group>.--button-delete_all").attr('tip', 'Удалить группу и учеников');

		$(".card-person>.--button-delete").attr('tip', 'Исключить из курса');
		
		$(".--button-delete").each(function(index, el) {
			tooltip.generate.tip_based(this);
			add_boundary.button-delete($(this));
		});

	/*	$(".--button-delete_all").each(function(index, el) {
			tooltip.generate.tip_based(this);
			add_boundary.button-delete_all($(this));
		}); */
		
		$("#create_group").show();
		editing = true;
	}
}

$(document).ready(function() {
	check_for_emptiness();

	$("h3").css('border-bottom', '1px dashed transparent');

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

/*	$("#create_group").click(function(event) {
		var new_group = $("<div class='group'><h3>Новая группа</h3></div>");
		$(".students").append(new_group);
		new_group.prepend(button_delete);
		new_group.prepend(button_delete_all);

		add_boundary.button-delete(new_group.find(".--button-delete"));
		new_group.find(".--button-delete").attr('tip', 'Удалить группу, сохранить учеников')
		tooltip.generate.tip_based(new_group.find(".--button-delete")[0]);

		add_boundary.button-delete_all(new_group.find(".--button-delete_all"));
		new_group.find(".--button-delete_all").attr('tip', 'Удалить группу и учеников')		
		tooltip.generate.tip_based(new_group.find(".--button-delete_all")[0]);

		check_for_emptiness();
		new_group.find("h3").css('border-bottom', '1px dashed #2196F3').attr("contenteditable", "true");
		$(".students").append(unordered);
	});*/
	$.extend({
		replaceTag: function (currentElem, newTagObj, keepProps) {
			var $currentElem = $(currentElem);
			var i, $newTag = $(newTagObj).clone();
			if (keepProps) {//{{{
				var nodes=[], values=[];
				newTag = $newTag[0];
				for (var att, i = 0, atts = currentElem.attributes, n = atts.length; i < n; i++){
					att = atts[i];
					newTag.setAttribute(att.nodeName, att.value);
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