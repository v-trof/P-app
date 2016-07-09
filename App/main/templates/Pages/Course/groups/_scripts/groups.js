var unordered;
var renames={};
function check_for_emptiness() {
	$(".group").each(function(index, el) {
		if($(this).children(".--card").length == 0) {
			if($(this).children(".--empty").length == 0) {
				$(this).append("<div class='--empty'>Пустая группа</div>");
			}
		} else {
			$(this).children('.--empty').remove();
		}
	});
}

var icon_add = '<div class"icon_add--wrapper">{% include "Elements/Icons/add.svg" %}</div>';

edit.end = function() {
	//getting pull_put down
	pull_put.is_pulled = true;
	pull_put.puller.cancel();
	

	//enabling group name editing
	$("h3").css('border-bottom', '1px dashed transparent').attr("contenteditable", "false");
	
	//removing delete btns
	$(".--button-delete").remove();
	
	//enabling links
	$(".students .--card").each(function(index, el) {
		$(this).attr('style', '');
		$(this).replaceTag("<a>", true);
	});


	
	//back stuff
	var groups={};
	
	var popup_invite = $(invite_students_text)
	$(popup_invite[2]).find("option").remove();
	$(".group").each(function(index, el) {
		group=$(this).children('h3').html();
		
		$(popup_invite[2]).append('<option value="' + group + '">'
			+ group + '</option>');

		groups[group]=[];
		
		$(this).find('.__name').each(function() {
			groups[group].push($(this).html());
		});
	});

	invite_students_text = popup_invite;
	$.ajax({
		type:"POST",
		url:"/func/edit_groups/",
		data: {
			   'groups_data': JSON.stringify(groups),
			   'csrfmiddlewaretoken': '{{ csrf_token }}',
			   'course_id': "{{course.id}}",
			   'renames':JSON.stringify(renames)
			  },
		success: function() {
			  notification.show('success', 'Группы изменены' );
			  $('#groups_content').load('../groups_content/');
			   }
	});
	$("#create_group").hide();
}

edit.start = function() {
	pull_put.is_pulled = false;

	$(".group>h3").css('border-bottom', '1px dashed #2196F3').attr("contenteditable", "true");
		
	//disabling links
	$(".students .--card").each(function(index, el) {
		$(this).replaceTag("<div>", true);
	});
	$(".students .--card").each(function() {
		pull_put.puller.add(
			$(this),
			["delete"]
		);
	});

	$(".group").each(function(index, el) {
		button_delete.add($(this));
		$(this).find(".--button-delete").css('margin-right', '3rem');
	});

	$( "h3" ).focusin(function() {
		prev_heading=$(this).html();
		$(this).focusout(function() {
			renames[prev_heading]=$(this).html();
		});
	});

	$( ".--button-delete" ).click(function() {
		prev_heading=$(this).parents().find("h3").html();
		renames[prev_heading]="Нераспределенные";
	});

	unordered.children('.--button-delete').remove();
	unordered.children('.--button-delete_all').remove();

	unordered.children("h3").css('border-bottom', '1px dashed transparent').attr("contenteditable", "false");

	$(".group>.--button-delete").attr('tip', 'Удалить группу (ученики будут исключены)');
			
	$("#create_group").show();

}

$(document).ready(function() {
	pull_put.delete_action = check_for_emptiness;
	check_for_emptiness();
	pull_put.is_pulled = true;
	sort_by_text($(".students"), "h3");

	$(".students h3").css('border-bottom', '1px dashed transparent');

	$(".group").each(function(index, el) {
		accordion.add($(this), "h3");
		sort_by_text($(this), ".__name");

		if($(this).children('h3').text() == "Нераспределенные") {
			unordered = $(this);
			if(unordered.find(".card.--user").length==0) {
				$(".students").append(unordered);
			} else {
				$(".students>h2").after(unordered);
			}
		}


		pull_put.put_zone.add($(this), function(e, $this, $pulled) {
			$this.append($pulled);
			check_for_emptiness();
			sort_by_text($this, ".__name");
			pull_put.reset();
		});
	});

	$("#create_group").hide();

	$("#create_group").click(function(event) {
		var new_group_counter=0;
		$("h3").each(function() {
			if ($(this).html().search( 'Новая группа' ) >= 0)
				new_group_counter+=1;
		});
		if (new_group_counter>0)
			var new_group = $("<div class='group'><h3>Новая группа "+new_group_counter+"</h3></div>");
		else var new_group = $("<div class='group'><h3>Новая группа</h3></div>");
		$(".students").append(new_group);
		accordion.add(new_group, "h3");

		check_for_emptiness();
		new_group.find("h3").css('border-bottom', '1px dashed #2196F3').attr("contenteditable", "true");
		
		if(unordered.find(".card.--user").length==0) {
			$(".students").append(unordered);
		} else {
			$(".students>h2").after(unordered);
		}

		pull_put.put_zone.add(new_group, function(e, $this, $pulled) {
			$this.append($pulled);
			check_for_emptiness();
			sort_by_text($this, "__name");
			pull_put.reset();
		});

		button_delete.add(new_group);
		new_group.find(".--button-delete").css('margin-right', '3rem');
	});

	$("h3").blur(function(event) {
		sort_by_text($(".students"), "h3");
	});
});





$.extend({
	replaceTag: function (currentElem, newTagObj, keepProps) {
		var $currentElem = $(currentElem);
		var i, $newTag = $(newTagObj).clone();
		if (keepProps) {//{{{
			var nodes=[], values=[];
			newTag = $newTag[0];
			for (var att, i = 0, atts = currentElem.attributes, n = atts.length; i < n; i++) {
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